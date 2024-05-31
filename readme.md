# Wallet Balance Checker Telegram Bot

This Telegram bot allows users to check their cryptocurrency wallet balances on different networks. Users can connect their wallets, select a network, and retrieve their balances through simple commands.

## Features

1. **Wallet Connection:**

   - Connect your wallet using the `/connect_wallet {walletAddress}` command.

2. **Network Selection:**

   - Select the network (ETH or BSC) using the `/select_network` command.

3. **Balance Retrieval:**
   - Retrieve your wallet balance using the `/balance` command.

## Commands

- **/start**

  - Welcome message with instructions on how to use the bot.

- **/connect_wallet {walletAddress}**

  - Connect your wallet by providing the wallet address.

- **/select_network**

  - Select the network (ETH or BSC) for balance retrieval.

- **/balance**
  - Retrieve the balance of the connected wallet.

## Prerequisites

- Node.js
- npm or yarn
- Telegram bot token

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Moganesan/evm-wallet-balance-checker-bot.git
   cd evm-wallet-balance-checker-bot
   ```
