let google;
try {
  ({ google } = require('googleapis'));
} catch {
  google = { auth: { OAuth2: class {} }, calendar: () => ({ events: { insert: async () => {} } }) };
}

let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch {
  nodemailer = { createTransport: () => ({ sendMail: async () => {} }) };
}

let twilio;
try {
  twilio = require('twilio');
} catch {
  twilio = () => ({ messages: { create: async () => {} } });
}

// Simple in-memory session store
const sessions = new Map();

class SchedulingService {
  constructor({ calendar, mailer, sms }) {
    this.calendar = calendar;
    this.mailer = mailer;
    this.sms = sms;
  }

  async proposeTimes(parties, timeSlots) {
    const sessionId = Date.now().toString();
    sessions.set(sessionId, { parties, timeSlots, confirmed: null });

    const message = `Please select one of the proposed times: ${timeSlots.join(', ')}`;
    await Promise.all(parties.map(async p => {
      if (p.email) {
        await this.mailer.sendMail({
          to: p.email,
          subject: 'Proposed meeting times',
          text: message
        });
      }
      if (p.phone) {
        await this.sms.messages.create({
          to: p.phone,
          from: process.env.TWILIO_FROM_NUMBER,
          body: message
        });
      }
    }));

    return sessionId;
  }

  async confirmTime(sessionId, selectedTime) {
    const session = sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    session.confirmed = selectedTime;

    // Create calendar event
    if (this.calendar) {
      await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: 'Scheduled Session',
          start: { dateTime: selectedTime },
          end: { dateTime: selectedTime },
        }
      });
    }

    const message = `Session confirmed for ${selectedTime}`;
    await Promise.all(session.parties.map(async p => {
      if (p.email) {
        await this.mailer.sendMail({ to: p.email, subject: 'Session confirmed', text: message });
      }
      if (p.phone) {
        await this.sms.messages.create({ to: p.phone, from: process.env.TWILIO_FROM_NUMBER, body: message });
      }
    }));
  }

  scheduleReminder(sessionId, reminderTime) {
    const session = sessions.get(sessionId);
    if (!session || !session.confirmed) return;

    const delay = new Date(reminderTime).getTime() - Date.now();
    if (delay <= 0) return;

    setTimeout(() => {
      const message = `Reminder: session at ${session.confirmed}`;
      session.parties.forEach(async p => {
        if (p.email) {
          await this.mailer.sendMail({ to: p.email, subject: 'Session reminder', text: message });
        }
        if (p.phone) {
          await this.sms.messages.create({ to: p.phone, from: process.env.TWILIO_FROM_NUMBER, body: message });
        }
      });
    }, delay);
  }
}

function createDefaultService() {
  // OAuth2 client for Google Calendar (expects env vars)
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  });

  const sms = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

  return new SchedulingService({ calendar, mailer, sms });
}

module.exports = { SchedulingService, createDefaultService };
