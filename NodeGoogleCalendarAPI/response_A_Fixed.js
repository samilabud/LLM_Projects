const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
const readline = require("readline");

const calendar = google.calendar("v3");

async function addToCalendar() {
  const keyfilePath = path.join(__dirname, "credentials.json");
  const credentials = JSON.parse(fs.readFileSync(keyfilePath));

  const { client_id, client_secret, redirect_uris } =
    credentials.installed || credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  const tokenPath = path.join(__dirname, "token.json");
  if (fs.existsSync(tokenPath)) {
    const token = fs.readFileSync(tokenPath);
    oAuth2Client.setCredentials(JSON.parse(token));
  } else {
    await getNewToken(oAuth2Client, tokenPath);
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

function getNewToken(oAuth2Client, tokenPath) {
  return new Promise((resolve, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar"],
    });
    console.log("Authorize this app by visiting this url:", authUrl);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Enter the code from that page here: ", (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) {
          return reject(new Error("Error retrieving access token"));
        }
        oAuth2Client.setCredentials(token);

        // Save the token for future use
        fs.writeFileSync(tokenPath, JSON.stringify(token));
        console.log("Token stored to", tokenPath);
        resolve();
      });
    });
  });
}

addToCalendar();
