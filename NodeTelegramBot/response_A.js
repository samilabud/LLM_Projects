const TelegramBot = require("node-telegram-bot-api");
const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const dotenv = require("dotenv");
const Message = require("./messageModel.js");

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
const stringSession = new StringSession(process.env.SESSION_STRING);

const Channel_ID = process.env.SOURCE_CHANNEL_ACCESS_ID;

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
  console.log("You should now be connected.");
  console.log(client.session.save());

  let i = 3;

  try {
    const result = await Message.findOne()
      .sort("-forward_origin_chat_id")
      .exec();
    console.log(result);
    // If a document was found, set 'i' to the maximum 'forward_origin_chat_id' found
    if (result) {
      i = result.forward_origin_chat_id + 1;
    }
  } catch (err) {
    console.log("Error in retrieving data from database", err);
  }

  // Define the source and destination channels. It is recommended to get them from the environment variables, to make it easier to modify in the future.
  const sourceChannelId = process.env.SOURCE_CHANNEL_ACCESS_ID;
  const destinationChannelId = process.env.DESTINATION_CHANNEL_ACCESS_ID;

  bot.on("channel_post", async (msg) => {
    try {
      const captionWithoutSender = msg.caption || ""; // Get original caption or use empty string

      // Forward media (video or document) with modified caption
      if (msg.video) {
        await bot.sendVideo(destinationChannelId, msg.video.file_id, {
          caption: captionWithoutSender,
        });
      } else if (msg.document) {
        await bot.sendDocument(destinationChannelId, msg.document.file_id, {
          caption: captionWithoutSender,
        });
      }

      // Store message details in the database, but you don't need to save all the fields
      const newMessage = new Message({
        chat_id: msg.message_id,
        forward_origin_chat_id: msg.forward_from_message_id, // Store for potential reference
      });
      await newMessage.save();
    } catch (error) {
      console.error("Error forwarding message or saving to database:", error);
    }
  });

  const sourceChannel = await client.getEntity(
    new Api.PeerChannel({ channelId: process.env.SOURCE_CHANNEL_ACCESS_ID })
  );
  const SOURCE_CHANNEL_ACCESS_HASH = sourceChannel.accessHash;
  console.log({ source: SOURCE_CHANNEL_ACCESS_HASH });

  const destiChannel = await client.getEntity(
    new Api.PeerChannel({
      channelId: process.env.DESTINATION_CHANNEL_ACCESS_ID,
    })
  );
  const DESTI_CHANNEL_ACCESS_HASH = destiChannel.accessHash;
  console.log({ source: DESTI_CHANNEL_ACCESS_HASH });

  setInterval(async () => {
    const element = i++;
    try {
      await client.invoke(
        new Api.messages.ForwardMessages({
          fromPeer: new Api.InputPeerChannel({
            channelId: sourceChannel.id,
            accessHash: sourceChannel.accessHash,
          }),
          id: [element],
          randomId: [
            BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)),
          ],
          toPeer: new Api.InputPeerChannel({
            channelId: destiChannel.id,
            accessHash: destiChannel.accessHash,
          }),
        })
      );

      console.log(element);
    } catch (error) {
      if (error.errorMessage === "MESSAGE_ID_INVALID") {
        console.error(
          `Message with ID ${element} does not exist or has been deleted.`
        );
      } else {
        console.error(`Failed to forward message with ID ${element}: ${error}`);
      }
    }
  }, 20000);
})();
