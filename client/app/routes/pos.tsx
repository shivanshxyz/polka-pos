import { useState, useEffect } from 'react';
import QrCodeGenerator from '~/components/QrCodeGenerator';
import { initializeClient } from '~/api/chain-client';

export default function PointOfSale() {
  const [merchantAddress, setMerchantAddress] = useState('');
  const [isSetup, setIsSetup] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  // Initialize client and monitor network status
  useEffect(() => {
    initializeClient();
    
    // Check if merchant address is saved
    const savedAddress = localStorage.getItem('merchantAddress');
    if (savedAddress) {
      setMerchantAddress(savedAddress);
      setIsSetup(true);
    }
    
    // Update online/offline status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSetupMerchant = () => {
    if (!merchantAddress) {
      alert('Please enter your Polkadot address');
      return;
    }
    
    // Save merchant address
    localStorage.setItem('merchantAddress', merchantAddress);
    setIsSetup(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Polkadot POS System</h1>
        <div className="flex items-center">
          <span className={`w-3 h-3 rounded-full mr-2 ${isOffline ? 'bg-red-500' : 'bg-green-500'}`}></span>
          <span>{isOffline ? 'Offline (Smoldot)' : 'Online'}</span>
        </div>
      </div>
      
      {!isSetup ? (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Merchant Setup</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Your Polkadot Address
            </label>
            <input
              type="text"
              value={merchantAddress}
              onChange={(e) => setMerchantAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your Polkadot address"
            />
          </div>
          
          <button
            onClick={handleSetupMerchant}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            Set Up Merchant
          </button>
        </div>
      ) : (
        <QrCodeGenerator merchantAddress={merchantAddress} />
      )}
    </div>
  );
}