import { useState, useEffect } from 'react';
import { QrDisplayPayload } from '@polkadot/react-qr';
import { u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { supportedTokens, generatePaymentData, getEnabledTokens } from '~/api/cross-chain';
import { initializeClient } from '~/api/chain-client';

interface QrCodeGeneratorProps {
  merchantAddress: string;
}

export default function QrCodeGenerator({ merchantAddress }: QrCodeGeneratorProps) {
  const [amount, setAmount] = useState('');
  const [selectedChain, setSelectedChain] = useState('dot'); // Default to DOT
  const [qrData, setQrData] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [qrSize, setQrSize] = useState(200);
  const [error, setError] = useState('');
  
  const enabledTokens = getEnabledTokens();

  // New state for Polkadot QR
  const [payloadData, setPayloadData] = useState<Uint8Array | null>(null);
  const [payloadAddress, setPayloadAddress] = useState<string>('');
  
  // Initialize API with a public node instead of localhost
  const [api, setApi] = useState<ApiPromise | null>(null);
  
  // Initialize client and monitor network status
  useEffect(() => {
    initializeClient();
    
    const handleResize = () => {
      // Adjust QR code size based on screen width
      const width = window.innerWidth;
      if (width < 500) {
        setQrSize(Math.min(width - 80, 200));
      } else {
        setQrSize(200);
      }
    };
    
    // Set initial size
    handleResize();
    
    // Update online/offline status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Initialize API with a public node instead of localhost
  useEffect(() => {
    const initApi = async () => {
      try {
        // Use a public node instead of localhost
        const wsProvider = new WsProvider('wss://rpc.polkadot.io');
        const newApi = await ApiPromise.create({ provider: wsProvider });
        await newApi.isReady;
        setApi(newApi);
      } catch (err) {
        console.error('Failed to connect to Polkadot node:', err);
        setError('Network connection failed. Using offline mode.');
      }
    };
    
    initApi();
    
    return () => {
      if (api) {
        api.disconnect();
      }
    };
  }, []);

  const handleGenerateQR = () => {
    try {
      setError('');
      
      if (!merchantAddress) {
        setError('Please enter your Polkadot address');
        return;
      }
      
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        setError('Please enter a valid amount');
        return;
      }
      
      // Create a simple payload with dummy transaction data
      // This is a placeholder and won't be a valid transaction
      // But it will generate a QR code for testing purposes
      const dummyPayload = new Uint8Array([0, 1, 2, 3, 4, 5]);
      
      // Get the address bytes
      const addressBytes = decodeAddress(merchantAddress);
      const addressHex = u8aToHex(addressBytes);
      
      setPayloadData(dummyPayload);
      setPayloadAddress(addressHex);
      
      // Keep the original implementation as fallback
      const paymentData = generatePaymentData(amount, selectedChain, merchantAddress);
      setQrData(JSON.stringify(paymentData));
    } catch (err) {
      console.error('Error generating QR code:', err);
      setError(err.message || 'Failed to generate QR code');
    }
  };

  const selectedToken = supportedTokens.find(t => t.id === selectedChain);

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-center">Paisa POS system</h2>
      
      {isOffline && (
        <div className="mb-4 p-2 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 rounded-md flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Offline Mode (Using Smoldot Light Client)
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Recipient Address
        </label>
        <input
          type="text"
          value={merchantAddress}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Your Polkadot address"
          disabled
        />
      </div>
      
      {/* Chain/Token selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Chain/Token
        </label>
        <select
          value={selectedChain}
          onChange={(e) => setSelectedChain(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled={enabledTokens.length <= 1}
        >
          {enabledTokens.map((token) => (
            <option key={token.id} value={token.id}>
              {token.symbol} ({token.name})
            </option>
          ))}
        </select>
        {supportedTokens.some(t => !t.enabled) && (
          <p className="text-xs mt-1 text-gray-500">
            To enable Kusama support, run: npx papi add ksm -n ksmcc3
          </p>
        )}
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Amount
        </label>
        <div className="flex items-center">
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
            placeholder="0.00"
          />
          <span className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-l-0 border-gray-300 rounded-r-md">
            {selectedToken?.symbol || 'DOT'}
          </span>
        </div>
      </div>
      
      <button
        onClick={handleGenerateQR}
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md"
      >
        REQUEST
      </button>
      
      {/* Replace the QR code rendering with the Polkadot component */}
      {payloadData && payloadAddress && (
        <div className="mt-6 flex flex-col items-center">
          <QrDisplayPayload
            address={payloadAddress}
            cmd={1}
            payload={payloadData}
            size={qrSize} 
            genesisHash={selectedChain === 'dot' 
              ? '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3'
              : '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe'
            }
          />
          <div className="mt-4 text-center">
            <div className="font-bold text-lg">
              {parseFloat(amount).toFixed(2)} {selectedToken?.symbol}
            </div>
            <div className="text-sm opacity-75 mt-1">
              on {selectedToken?.name}
            </div>
            <div className="text-xs mt-2 max-w-xs break-all">
              {merchantAddress.substring(0, 10)}...{merchantAddress.substring(merchantAddress.length - 8)}
            </div>
          </div>
        </div>
      )}
      {/* Keep the old QR code as fallback until the new implementation is fully tested */}
      {qrData && !payloadData && (
        <div className="mt-6 flex flex-col items-center">
          {/* Your existing QR code implementation */}
        </div>
      )}
    </div>
  );
}