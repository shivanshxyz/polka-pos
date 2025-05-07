import { dot } from "@polkadot-api/descriptors"
// After running: npx papi add ksm -n ksmcc3
// import { ksmcc3 } from "@polkadot-api/descriptors"
import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { getWsProvider } from "polkadot-api/ws-provider/web"
import { startFromWorker } from "polkadot-api/smoldot/from-worker"
import { chainSpec as polkadotChainSpec } from "polkadot-api/chains/polkadot"
// After adding Kusama:
import { chainSpec as ksmChainSpec } from "polkadot-api/chains/ksmcc3"

// For Vite
import SmWorker from "polkadot-api/smoldot/worker?worker"
import { ksmcc3 } from "polkadot-api/chains"

// Maintain client instances
let dotClient = null;
let ksmClient = null;

/**
 * Initialize a Smoldot light client for Polkadot
 */
export const setupPolkadotClient = async (useSmoldot = false) => {
  if (dotClient) return dotClient;
  
  try {
    if (navigator.onLine && !useSmoldot) {
      // Use WebSocket for online mode
      console.log("Initializing Polkadot WebSocket client...");
      const provider = getWsProvider('wss://rpc.polkadot.io');
      dotClient = createClient(provider);
    } else {
      // Use Smoldot for offline mode
      console.log("Initializing Polkadot Smoldot light client...");
      const worker = new SmWorker();
      const smoldot = startFromWorker(worker);
      const chain = await smoldot.addChain({ chainSpec: polkadotChainSpec });
      dotClient = createClient(getSmProvider(chain));
    }
    return dotClient;
  } catch (error) {
    console.error("Failed to initialize Polkadot client:", error);
    throw error;
  }
}

/**
 * Initialize a Smoldot light client for Kusama
 * Note: This requires running `npx papi add ksm -n ksmcc3` first
 */
export const setupKusamaClient = async (useSmoldot = false) => {
  // This function is commented out until Kusama support is added
  // Uncomment after running: npx papi add ksm -n ksmcc3
  

  if (ksmClient) return ksmClient;
  
  try {
    if (navigator.onLine && !useSmoldot) {
      // Use WebSocket for online mode
      console.log("Initializing Kusama WebSocket client...");
      const provider = getWsProvider('wss://kusama-rpc.polkadot.io');
      ksmClient = createClient(provider);
    } else {
      // Use Smoldot for offline mode
      console.log("Initializing Kusama Smoldot light client...");
      const worker = new SmWorker();
      const smoldot = startFromWorker(worker);
      const chain = await smoldot.addChain({ chainSpec: ksmChainSpec });
      ksmClient = createClient(getSmProvider(chain));
    }
    return ksmClient;
  } catch (error) {
    console.error("Failed to initialize Kusama client:", error);
    throw error;
  }

  
  // For now, return an error that Kusama support needs to be added
  // throw new Error("Kusama support is not yet enabled. Run 'npx papi add ksm -n ksmcc3' and uncomment the Kusama client code.");
}

/**
 * Get the typed API for Polkadot
 */
export const getPolkadotApi = async (useSmoldot = false) => {
  const client = await setupPolkadotClient(useSmoldot);
  return client.getTypedApi(dot);
}

/**
 * Get the typed API for Kusama
 * Note: This requires running `npx papi add ksm -n ksmcc3` first
 */
export const getKusamaApi = async (useSmoldot = false) => {
  // Uncomment after running: npx papi add ksm -n ksmcc3

  const client = await setupKusamaClient(useSmoldot);
  return client.getTypedApi(ksmcc3);

  
  // For now, return an error that Kusama support needs to be added
  // throw new Error("Kusama support is not yet enabled. Run 'npx papi add ksm -n ksmcc3' and uncomment the Kusama client code.");
}

/**
 * Initialize clients based on network status
 */
export const initializeClient = async () => {
  // Set up event listeners for online/offline status
  window.addEventListener('online', async () => {
    console.log("Network connection restored, refreshing clients");
    // Reset clients so they'll be recreated with WebSocket
    dotClient = null;
    ksmClient = null;
  });
  
  // Start with Polkadot client
  await setupPolkadotClient();
  
  return { dotClient };
}