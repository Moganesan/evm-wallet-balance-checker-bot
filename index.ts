import telegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import axios from "axios";
import { ethers } from "ethers";

dotenv.config();

const BOT_TOKEN: any = process.env.BOT_TOKEN;

const userDetails: any = [];

const bot = new telegramBot(BOT_TOKEN, { polling: true });

bot.setMyCommands([
  {
    command: "/start",
    description: "welcome to the balance checker bot",
  },
  {
    command: "/connect_wallet",
    description: "run /connect_wallet {walletAddressd}",
  },
  {
    command: "/select_network",
    description: "run /select_network to select network",
  },
  {
    command: "/balance",
    description: "run /balance to retrive balance",
  },
]);

bot.onText(/\/start/, async (msg, match) => {
  bot.sendMessage(
    msg.chat.id,
    "Welcome to wallet balance checker bot\n1.run /select_network to select network.\n2.run /connect_wallet {walletAddress} to connect wallet.\n3.run /balance to check balance."
  );
});

bot.onText(/\/select_network/, async (msg, match) => {
  bot.sendMessage(msg.chat.id, "Select network", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "ETH", callback_data: "select_network_eth" },
          { text: "BSC", callback_data: "selected_network_bsc" },
        ],
      ],
    },
  });
});

bot.onText(/\/balance/, async (msg, match) => {
  const username = msg.chat.username;
  const userdetails = userDetails.find(
    (user: any) => user.username == username
  );

  if (!userdetails?.walletAddress) {
    bot.sendMessage(
      msg.chat.id,
      "Wallet not connected. run /connect_wallet {address} to connect."
    );
    return;
  }
  if (userdetails.network == "bsc") {
    const API_END_POINT: any = process.env.BSC_API_END_POINT;
    const BSC_SCAN_API_KEY = process.env.BSC_SCAN_API_KEY;
    const balance = await axios.get(
      API_END_POINT +
        "?module=account&action=balance&address=" +
        userdetails.walletAddress +
        "&apikey=" +
        BSC_SCAN_API_KEY
    );

    bot.sendMessage(msg.chat.id, balance.data.result);
    return;
  } else if (userdetails.network == "eth") {
    const API_END_POINT: any = process.env.ETH_SCAN_API_END_POINT;
    const ETH_SCAN_API_KEY = process.env.ETH_SCAN_API_KEY;
    const balance = await axios.get(
      API_END_POINT +
        "?module=account&action=balance&address=" +
        userdetails.walletAddress +
        "&apikey=" +
        ETH_SCAN_API_KEY
    );

    bot.sendMessage(msg.chat.id, balance.data.result);
    return;
  }
});

bot.onText(/\/connect_wallet (.+)/, async (msg, match: any) => {
  const walletAddress = match[1];
  const username = msg.chat.username;
  const isCorrect = ethers.utils.isAddress(walletAddress);
  const checkWallet = userDetails.findIndex(
    (user: any) => user.username == username
  );
  if (!isCorrect) {
    bot.sendMessage(msg.chat.id, "Invalid wallet address.");
    return;
  }
  if (userDetails[checkWallet].walletAddress) {
    bot.sendMessage(msg.chat.id, "Wallet address updated.");
    userDetails[checkWallet].walletAddress = walletAddress;
    return;
  }

  userDetails.push({
    username: username,
    walletAddress: walletAddress,
    network: "eth",
  });

  bot.sendMessage(msg.chat.id, "Wallet connected!");
  return;
});
// Handle callback queries
bot.on("callback_query", function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg: any = callbackQuery.message;
  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
  };

  console.log(action);
  let text = "";

  if (action === "select_network_eth") {
    if (
      userDetails.find(
        (user: any) => user.username == callbackQuery.from.username
      )
    ) {
      const index = userDetails.findIndex(
        (user: any) => user.userName == callbackQuery.from.username
      );
      userDetails[index].network = "eth";
    } else {
      userDetails.push({
        username: callbackQuery.from.username,
        network: "eth",
      });
    }
    text = "ETH selected";
  } else if (action == "selected_network_bsc") {
    if (
      userDetails.find(
        (user: any) => user.username == callbackQuery.from.username
      )
    ) {
      const index = userDetails.findIndex(
        (user: any) => user.username == callbackQuery.from.username
      );
      userDetails[index].network = "bsc";
    } else {
      userDetails.push({
        username: callbackQuery.from.username,
        network: "bsc",
      });
    }
    text = "BSC Selected";
  }

  bot.editMessageText(text, opts);
});
