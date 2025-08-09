const test = require('node:test');
const assert = require('assert');
const { SchedulingService } = require('../services/scheduleService');

test('propose, confirm and remind', async () => {
  const emails = [];
  const sms = [];
  const events = [];

  const service = new SchedulingService({
    calendar: { events: { insert: async (e) => events.push(e) } },
    mailer: { sendMail: async (m) => emails.push(m) },
    sms: { messages: { create: async (m) => sms.push(m) } }
  });

  const parties = [
    { email: 'a@example.com', phone: '+10000000001' },
    { email: 'b@example.com' }
  ];
  const times = ['2025-01-01T10:00:00Z', '2025-01-01T11:00:00Z'];
  const sessionId = await service.proposeTimes(parties, times);

  assert.ok(sessionId);
  assert.equal(emails.length, 2);
  assert.equal(sms.length, 1);

  await service.confirmTime(sessionId, times[0]);
  assert.equal(events.length, 1);
  assert.equal(emails.length, 4);
  assert.equal(sms.length, 2);

  await new Promise(resolve => {
    service.scheduleReminder(sessionId, new Date(Date.now() + 50).toISOString());
    setTimeout(resolve, 100);
  });

  assert.equal(emails.length, 6);
  assert.equal(sms.length, 3);
});
