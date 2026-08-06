'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadNodeCode, runNode } = require('../helpers/n8n-mock.js');

const jsCode = loadNodeCode('n8n_emma_tools.json', 'Pick Status Prefix');

// `summary` is the calendar event's current title (output of "Get Event For
// Status", i.e. this node's $json). `extractCallData` is the fixture for the
// $('Extract Call Data') node reference.
function pickPrefix({ summary, eventId = 'evt-1', status, dyn = { phone_number: '+15551234567' } }) {
  return runNode(jsCode, {
    input: [{ summary }],
    nodeRefs: {
      'Extract Call Data': { event_id: eventId, status, dyn },
    },
  });
}

test('confirmed status gets the [CONFIRMED] prefix, no retry', () => {
  const result = pickPrefix({ summary: 'Jane Doe - Appointment', status: 'confirmed' });
  assert.deepEqual(result, [
    { json: { event_id: 'evt-1', prefix: '[CONFIRMED]', retry: false, dyn: { phone_number: '+15551234567' } } },
  ]);
});

test('voicemail status gets [NO ANSWER] directly, never retried (ADR 0020)', () => {
  const result = pickPrefix({ summary: 'Jane Doe - Appointment', status: 'voicemail' });
  assert.equal(result[0].json.prefix, '[NO ANSWER]');
  assert.equal(result[0].json.retry, false);
});

test('first true no-answer triggers exactly one retry', () => {
  const result = pickPrefix({ summary: 'Jane Doe - Appointment', status: 'no_answer' });
  assert.equal(result[0].json.prefix, '[RETRY]');
  assert.equal(result[0].json.retry, true);
});

test('no-answer after an already-stamped [RETRY] does not retry again (2-attempt cap)', () => {
  const result = pickPrefix({ summary: '[RETRY] Jane Doe - Appointment', status: 'no_answer' });
  assert.equal(result[0].json.prefix, '[NO ANSWER]');
  assert.equal(result[0].json.retry, false);
});

test('accepts the "no answer" (space-separated) status spelling', () => {
  const result = pickPrefix({ summary: 'Jane Doe - Appointment', status: 'no answer' });
  assert.equal(result[0].json.prefix, '[RETRY]');
  assert.equal(result[0].json.retry, true);
});

test('[RETRY] must be at the very start of the summary to count as already-retried', () => {
  const result = pickPrefix({ summary: 'Jane Doe [RETRY] - Appointment', status: 'no_answer' });
  assert.equal(result[0].json.prefix, '[RETRY]');
  assert.equal(result[0].json.retry, true);
});

test('unrecognized status produces no output (nothing to stamp)', () => {
  const result = pickPrefix({ summary: 'Jane Doe - Appointment', status: 'busy' });
  assert.deepEqual(result, []);
});

test('missing summary is treated as an empty title, not already retried', () => {
  const result = pickPrefix({ summary: undefined, status: 'no_answer' });
  assert.equal(result[0].json.prefix, '[RETRY]');
});

test('event_id and dyn vars from Extract Call Data pass through unchanged', () => {
  const result = pickPrefix({
    summary: 'Jane Doe - Appointment',
    eventId: 'evt-xyz',
    status: 'confirmed',
    dyn: { phone_number: '+1999', email: 'jane@example.com' },
  });
  assert.equal(result[0].json.event_id, 'evt-xyz');
  assert.deepEqual(result[0].json.dyn, { phone_number: '+1999', email: 'jane@example.com' });
});
