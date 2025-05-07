// This will need to be expanded with actual chain descriptors that you generate
// You'll need to run: npx papi add ksm -n kusama, etc. for other chains
import { dot } from "@polkadot-api/descriptors"
// Import other chain descriptors after generating them
// import { ksmcc3 } from "@polkadot-api/descriptors" 
import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { getWsProvider } from "polkadot-api/ws-provider/web"
import { startFromWorker } from "polkadot-api/smoldot/from-worker"
import { chainSpec as polkadotChainSpec } from "polkadot-api/chains/polkadot"
// Import other chain specs as needed
// import { chainSpec as ksmChainSpec } from "polkadot-api/chains/ksmcc3"

// For Vite
import SmWorker from "polkadot-api/smoldot/worker?worker"

// Define supported tokens and chains
export const supportedTokens = [
  { 
    id: 'dot', 
    name: 'polkadot',
    chain: 'polkadot', 
    symbol: 'DOT', 
    decimals: 10,
    wsEndpoint: 'wss://rpc.polkadot.io',
    logo: '/chain-logos/polkadot.svg',
    enabled: true
  },
  { 
    id: 'ksm', 
    name: 'kusama',
    chain: 'ksmcc3', 
    symbol: 'KSM', 
    decimals: 12,
    wsEndpoint: 'wss://kusama-rpc.polkadot.io',
    logo: '/chain-logos/kusama.svg',
    enabled: true
  }
];

// Store clients for each chain
const chainClients = {};

/**
 * Get or create a client for a specific chain
 * @param chainId The chain identifier
 * @param forceSmoldot Force using Smoldot even when online
 */
export const getChainClient = async (chainId, forceSmoldot = false) => {
  // If client already exists, return it
  if (chainClients[chainId]) return chainClients[chainId];
  
  // Find the token configuration
  const token = supportedTokens.find(t => t.id === chainId);
  if (!token) {
    throw new Error(`Unsupported chain: ${chainId}`);
  }
  
  // Create client based on connection status
  let client;
  if (navigator.onLine && !forceSmoldot) {
    // Use WebSocket for online mode
    console.log(`Initializing WebSocket client for ${token.name}...`);
    const provider = getWsProvider(token.wsEndpoint);
    client = createClient(provider);
  } else {
    // Use Smoldot for offline mode
    console.log(`Initializing Smoldot light client for ${token.name}...`);
    const worker = new SmWorker();
    const smoldot = startFromWorker(worker);
    const chain = await smoldot.addChain({ chainSpec: token.chainSpec });
    client = createClient(getSmProvider(chain));
  }
  
  // Store and return the client
  chainClients[chainId] = {
    client,
    descriptor: token.descriptor,
    token
  };
  
  return chainClients[chainId];
};

/**
 * Generate payment data for QR code
 * @param amount The payment amount
 * @param chainId The chain/token to use
 * @param recipientAddress The recipient's address
 */
export const generatePaymentData = (amount, chainId, recipientAddress) => {
  const token = supportedTokens.find(t => t.id === chainId);
  if (!token) {
    throw new Error(`Unsupported chain: ${chainId}`);
  }
  
  if (!token.enabled) {
    throw new Error(`${token.name} support is not yet enabled. Run 'npx papi add ksm -n ksmcc3' and update the token configuration.`);
  }
  
  // Calculate amount with proper decimals
  const rawAmount = BigInt(Math.floor(parseFloat(amount) * (10 ** token.decimals)));
  
  // Format data for QR code
  return {
    chain: token.chain,
    recipient: recipientAddress,
    amount: rawAmount.toString(),
    symbol: token.symbol,
    decimals: token.decimals
  };
};

/**
 * Get enabled tokens
 */
export const getEnabledTokens = () => {
  return supportedTokens.filter(token => token.enabled);
};