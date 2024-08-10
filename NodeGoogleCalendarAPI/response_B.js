const { google } = require("googleapis");
const localAuth = require("@google-cloud/local-auth");
const path = require("path");

const calendar = google.calendar("v3");

async function addToCalendar() {
  const auth = await localAuth.auth({
    keyfilePath: path.join(__dirname, "credentials.json"),
    scopes: "https://www.googleapis.com/auth/calendar",
  });

  google.options({ auth });

  const event = {
    summary: "Team Meeting",
    location: "Online",
    description: "Discuss project updates",
    start: {
      dateTime: "2024-03-15T09:00:00-07:00",
      timeZone: "America/Los_Angeles",
    },
    end: {
      dateTime: "2024-03-15T10:00:00-07:00",
      timeZone: "America/Los_Angeles",
    },
    attendees: [
      { email: "attendee1@example.com" },
      { email: "attendee2@example.com" },
    ],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
  };

  try {
    const { data } = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });
    console.log(`Event created: ${data.htmlLink}`);
  } catch (error) {
    console.log("The API returned an error: " + error);
  }
}

addToCalendar();
