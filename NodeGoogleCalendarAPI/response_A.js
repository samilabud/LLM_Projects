const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

// Replace with your actual values
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const TOKEN_PATH = "token.json";

// Load client secrets from a local file
fs.readFile("credentials.json", (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  authorize(JSON.parse(content), createEvent);
});

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);

      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error("Error saving token to disk", err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function createEvent(auth) {
  const calendar = google.calendar({ version: "v3", auth });
  const event = {
    summary: "Team Meeting",
    location: "Conference Room A",
    description: "Discuss project updates and next steps",
    start: {
      dateTime: "2024-08-20T10:00:00", // Adjust date and time
      timeZone: "America/Los_Angeles", // Adjust timezone
    },
    end: {
      dateTime: "2024-08-20T11:00:00", // Adjust date and time
      timeZone: "America/Los_Angeles", // Adjust timezone
    },
  };
  calendar.events.insert(
    {
      auth: auth,
      calendarId: "primary", // Or specific calendar ID
      resource: event,
    },
    (err, event) => {
      if (err) return console.log("Error creating event:", err);
      console.log("Event created:", event.data.htmlLink);
    }
  );
}
