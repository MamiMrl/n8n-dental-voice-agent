// Runs an n8n Code node's jsCode string, unmodified, straight out of a
// workflow JSON file — against a mocked n8n execution context. This lets
// tests exercise the literal code that ships in the JSON, so there is no
// separate "tested copy" that can drift from what n8n actually runs.
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { DateTime } = require('luxon');

const REPO_ROOT = path.join(__dirname, '..', '..');

function loadNodeCode(workflowFile, nodeName) {
  const workflowPath = path.join(REPO_ROOT, workflowFile);
  const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
  const node = workflow.nodes.find((n) => n.name === nodeName);
  if (!node) {
    throw new Error(`Node "${nodeName}" not found in ${workflowFile}`);
  }
  if (typeof node.parameters.jsCode !== 'string') {
    throw new Error(`Node "${nodeName}" has no jsCode parameter`);
  }
  return node.parameters.jsCode;
}

// Mocks n8n's `$('Other Node')` accessor: `.first().json` / `.all()`.
// `nodeRefs` maps node name -> a single json object or an array of json objects.
function makeNodeRefLookup(nodeRefs) {
  return function nodeRef(name) {
    if (!(name in nodeRefs)) {
      throw new Error(`No fixture registered for node reference: $('${name}')`);
    }
    const value = nodeRefs[name];
    const items = Array.isArray(value) ? value : [value];
    return {
      first: () => ({ json: items[0] }),
      all: () => items.map((json) => ({ json })),
    };
  };
}

// Wraps Luxon's DateTime so `DateTime.now()` returns a fixed instant,
// keeping tests deterministic regardless of the day/time they're run on.
// Every other DateTime static (fromISO, fromMillis, ...) passes through untouched.
function fixedClockDateTime(fixedNowMillis) {
  return new Proxy(DateTime, {
    get(target, prop, receiver) {
      if (prop === 'now') {
        return () => target.fromMillis(fixedNowMillis);
      }
      return Reflect.get(target, prop, receiver);
    },
  });
}

// Executes `jsCode` (an n8n Code node's "Run Once for All Items" body) with
// a mocked n8n context.
//
// options:
//   input   — array of plain json objects representing this node's input items
//             ($input.all()/$input.first(), and $json = input[0])
//   nodeRefs — { 'Node Name': json | json[] } for $('Node Name') lookups
//   now      — epoch millis to fix DateTime.now() to (omit to use the real clock)
function runNode(jsCode, { input = [], nodeRefs = {}, now } = {}) {
  const items = input.map((json) => ({ json }));
  const context = {
    $input: {
      all: () => items,
      first: () => items[0],
    },
    $json: items.length ? items[0].json : undefined,
    $: makeNodeRefLookup(nodeRefs),
    DateTime: now === undefined ? DateTime : fixedClockDateTime(now),
    console,
  };
  vm.createContext(context);
  const script = new vm.Script(`(function () {\n${jsCode}\n})()`);
  const result = script.runInContext(context);
  // Objects created inside the vm context belong to a different JS realm, so
  // their Array/Object prototypes differ from the test file's — that fails
  // assert.deepStrictEqual even for structurally identical values. Round-trip
  // through JSON to hand back plain main-realm objects (n8n items are
  // JSON-safe data anyway, so nothing observable is lost).
  return JSON.parse(JSON.stringify(result));
}

module.exports = { loadNodeCode, runNode };
