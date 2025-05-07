# PolkaPOS

![Polkadot Hackathon](https://github.com/user-attachments/assets/1c57edf3-3689-4198-930a-6e36876a6fe8)

## Problem Statement

- Modern wallet app transaction procedure is very alien for people who barely know how to even use a phone
- This is a huge roadblock when is comes to mass adoption of crypto among small business owners
- Present solution has way more friction when compared to using cash

## Solution

- An easy to use POS system where there is no need to even install an app. Everyone can start accepting payments within seconds
- I implemented way to get transaction alerts without even opening your phone so that you can shift your focus on stuff that truly matters
- The system is so effortless that everyone can use it

## How it works
The system is divided into two parts
|                                               **Web based payment kiosk**                                               |                                               **Low cost payment alert soundbox**                                              |
|:-----------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------------------:|
|                 No nonsense payment requests through an intuitive interface. Just get started right away                | A smart speaker that makes automated sound alerts whenever the vendor receives any amount in their wallet using text to speech |
| Just enter your polkadot address and the amount you want to receive and the kiosk will generate a custom amount QR code using `@polkadot/react-qr` |                                 Uses very low cost hardware microcontrollers like Raspberry pi                                 |
|             The customer uses the QR code scanner from their phone and can pay through their wallet app            |                      The smart speaker uses PAPI with Smoldot service worker to monitor wallet transactions for both Polkadot and Kusama                     |
|                                                                                                                         | No need to check your wallet every after every transaction so that you can focus on stuff that truly matters|

## Polkadot Tech Implementation

- Polkadot.js libraries (`@polkadot/react-qr`, `@polkadot/util`, `@polkadot/api`) for blockchain interaction and QR code generation
- Smoldot light client integration allowing the POS to function offline without requiring a full node
- Multi-chain support for both Polkadot and Kusama networks with easy switching between tokens
- Universal QR code standard compatible with Polkadot mobile wallets for seamless payment processing
- Direct connection to Polkadot nodes via WebSocket when online for real-time transaction status
- Address handling with Polkadot's SS58 format using `@polkadot/util-crypto` for security

## Project setup installations are in the subfolders
