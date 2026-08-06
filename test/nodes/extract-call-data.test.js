'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadNodeCode, runNode } = require('../helpers/n8n-mock.js');

const jsCode = loadNodeCode('n8n_emma_tools.json', 'Extract Call Data');

function webhookPayload(body) {
  return runNode(jsCode, { input: [{ body }] });
}

function callAnalyzedBody({ eventId = 'evt-1', phoneNumber = '+15551234567', status = 'confirmed' } = {}) {
  return {
    event: 'call_analyzed',
    call: {
      retell_llm_dynamic_variables: { event_id: eventId, phone_number: phoneNumber },
      call_analysis: { custom_analysis_data: { appointment_status: status } },
    },
  };
}

test('passes through event_id, lowercased status, and dyn vars for a confirmed call', () => {
  const result = webhookPayload(callAnalyzedBody({ status: 'Confirmed' }));
  assert.deepEqual(result, [
    {
      json: {
        event_id: 'evt-1',
        status: 'confirmed',
        dyn: { event_id: 'evt-1', phone_number: '+15551234567' },
      },
    },
  ]);
});

test('passes through a voicemail status', () => {
  const result = webhookPayload(callAnalyzedBody({ status: 'voicemail' }));
  assert.equal(result[0].json.status, 'voicemail');
});

test('passes through a no_answer status', () => {
  const result = webhookPayload(callAnalyzedBody({ status: 'no_answer' }));
  assert.equal(result[0].json.status, 'no_answer');
});

test('ignores webhook events other than call_analyzed', () => {
  const result = webhookPayload({ event: 'call_started', call: {} });
  assert.deepEqual(result, []);
});

test('ignores a payload with no event field at all', () => {
  const result = webhookPayload({});
  assert.deepEqual(result, []);
});

test('ignores a call_analyzed payload missing event_id', () => {
  const body = callAnalyzedBody();
  delete body.call.retell_llm_dynamic_variables.event_id;
  assert.deepEqual(webhookPayload(body), []);
});

test('ignores a call_analyzed payload with no call object at all', () => {
  const result = webhookPayload({ event: 'call_analyzed' });
  assert.deepEqual(result, []);
});

test('defaults status to empty string when custom_analysis_data is missing', () => {
  const body = callAnalyzedBody();
  delete body.call.call_analysis;
  const result = webhookPayload(body);
  assert.equal(result[0].json.status, '');
});
