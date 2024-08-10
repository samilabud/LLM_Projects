const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

const calendar = google.calendar("v3");

async function addToCalendar() {
  const keyfilePath = path.join(__dirname, "credentials.json");
  const credentials = JSON.parse(fs.readFileSync(keyfilePath));

  const { client_id, client_secret, redirect_uris } =
    credentials.installed || credentials.web;

  // Use google.auth.OAuth2 instead of OAuth2
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Load previously saved token, or request a new one
  const tokenPath = path.join(__dirname, "token.json");
  if (fs.existsSync(tokenPath)) {
    const token = fs.readFileSync(tokenPath);
    oAuth2Client.setCredentials(JSON.parse(token));
  } else {
    // Get and save the new token
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: "https://www.googleapis.com/auth/calendar",
    });

    console.log("Authorize this app by visiting this url:", authUrl);
    // After authorization, you'd need to exchange the code for a token
    // and save it in token.json for future use.
  }

  google.options({ auth: oAuth2Client });

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
