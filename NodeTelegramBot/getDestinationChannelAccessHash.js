const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { Api } = require("telegram");
const input = require("input");
const dotenv = require("dotenv");

dotenv.config();

const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
const stringSession = new StringSession(process.env.SESSION_STRING);

(async () => {
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });
  console.log("You are now connected.");

  // Replace with your actual destination channel username or ID
  //   const destinationChannel = await client.getEntity(
  //     "destination_channel_username_or_id"
  //   );
  //   const dialogs = await client.getDialogs();
  //   dialogs.forEach((dialog) => {
  //     console.log(dialog.title, dialog.id);
  //   });
  const destinationChannel = await client.getEntity(
    "https://t.me/turingtester"
  ); // For private channels using invite link

  console.log(`Destination Channel ID: ${destinationChannel.id}`);
  console.log(
    `Destination Channel Access Hash: ${destinationChannel.accessHash}`
  );
})();
