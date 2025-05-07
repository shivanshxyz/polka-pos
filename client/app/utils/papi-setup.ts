/**
 * PAPI Chain Setup Guide
 * 
 * To add additional chains, run the following commands:
 * 
 * For Kusama:
 * npx papi add ksm -n ksmcc3
 * 
 * For Polkadot Asset Hub (formerly Statemint):
 * npx papi add asset_hub -n polkadot_asset_hub
 * 
 * For Kusama Asset Hub:
 * npx papi add ksm_asset_hub -n ksmcc3_asset_hub
 * 
 * For other supported chains, check the list in the error message:
 * - polkadot_bridge_hub
 * - polkadot_collectives
 * - polkadot_coretime
 * - westend2
 * 
 * For chains not listed (like Acala, Moonbeam), you'll need to use:
 * npx papi add [name] --endpoint [wss-endpoint-url]
 * 
 * Example:
 * npx papi add acala --endpoint wss://acala-rpc.dwellir.com
 * npx papi add moonbeam --endpoint wss://moonbeam.public.blastapi.io
 */

// This is a documentation file, no code to export
