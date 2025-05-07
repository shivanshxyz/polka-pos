import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { dot, ksmcc3 } from '@polkadot-api/descriptors';  // Assuming you've generated these
import { createClient } from 'polkadot-api';
import { getSmProvider } from 'polkadot-api/sm-provider';
import { chainSpec as polkadotChainSpec } from 'polkadot-api/chains/polkadot';
import { chainSpec as kusamaChainSpec } from 'polkadot-api/chains/ksmcc3';
import { start } from 'polkadot-api/smoldot';
import { TtsService } from '../tts/tts.service';

interface MerchantInfo {
  address: string;
  name: string;
  chain: 'polkadot' | 'kusama';
}

@Injectable()
export class BlockchainService implements OnModuleInit {
  private readonly logger = new Logger(BlockchainService.name);
  private smoldot: any;
  private dotClient: any;
  private ksmClient: any;
  private dotApi: any;
  private ksmApi: any;
  private merchants: MerchantInfo[] = [];
  private subscriptions: { unsubscribe: () => void }[] = [];

  constructor(private readonly ttsService: TtsService) {}

  async onModuleInit() {
    await this.initializeClients();
    await this.loadMerchants();
    await this.startMonitoring();
  }

  private async initializeClients() {
    try {
      this.logger.log('Initializing blockchain clients...');
      // Initialize Smoldot
      this.smoldot = start();

      // Initialize Polkadot client
      const dotChain = await this.smoldot.addChain({ chainSpec: polkadotChainSpec });
      this.dotClient = createClient(getSmProvider(dotChain));
      this.dotApi = this.dotClient.getTypedApi(dot);
      this.logger.log('Polkadot client initialized');

      // Initialize Kusama client
      const ksmChain = await this.smoldot.addChain({ chainSpec: kusamaChainSpec });
      this.ksmClient = createClient(getSmProvider(ksmChain));
      this.ksmApi = this.ksmClient.getTypedApi(ksmcc3);
      this.logger.log('Kusama client initialized');
    } catch (error) {
      this.logger.error('Failed to initialize blockchain clients:', error);
    }
  }

  private async loadMerchants() {
    // In a real app, load from database
    // For now, hardcode some test merchants
    this.merchants = [
      { 
        address: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5', 
        name: 'Test Merchant',
        chain: 'polkadot'
      }
    ];
    this.logger.log(`Loaded ${this.merchants.length} merchants for monitoring`);
  }

  private async startMonitoring() {
    // Monitor Polkadot transfers
    const dotSubscription = this.dotApi.events.Balances.Transfer.subscribe(
      (event) => this.handleTransferEvent(event, 'polkadot', 'DOT')
    );
    this.subscriptions.push(dotSubscription);
    this.logger.log('Started monitoring Polkadot transfers');

    // Monitor Kusama transfers
    const ksmSubscription = this.ksmApi.events.Balances.Transfer.subscribe(
      (event) => this.handleTransferEvent(event, 'kusama', 'KSM')
    );
    this.subscriptions.push(ksmSubscription);
    this.logger.log('Started monitoring Kusama transfers');
  }

  private async handleTransferEvent(event: any, chain: string, symbol: string) {
    const { from, to, amount } = event.data;
    
    // Check if transfer is to one of our merchants
    const merchant = this.merchants.find(m => 
      m.address === to && m.chain === chain
    );

    if (merchant) {
      // Format amount based on token decimals
      const decimals = symbol === 'DOT' ? 10 : 12;
      const formattedAmount = Number(amount) / Math.pow(10, decimals);
      
      this.logger.log(`Payment received: ${formattedAmount} ${symbol} to ${merchant.name}`);
      
      // Announce the payment using text-to-speech
      this.ttsService.speak(
        `Payment received: ${formattedAmount} ${symbol} for ${merchant.name}`
      );
    }
  }

  // API for the frontend to register merchants
  async registerMerchant(merchantInfo: MerchantInfo): Promise<boolean> {
    try {
      // Check if merchant already exists
      const existing = this.merchants.find(m => 
        m.address === merchantInfo.address && m.chain === merchantInfo.chain
      );

      if (existing) {
        return true; // Already registered
      }

      // Add new merchant
      this.merchants.push(merchantInfo);
      this.logger.log(`Registered new merchant: ${merchantInfo.name}`);
      return true;
    } catch (error) {
      this.logger.error('Failed to register merchant:', error);
      return false;
    }
  }

  // API for the frontend to remove merchants
  async removeMerchant(address: string, chain: string): Promise<boolean> {
    try {
      const initialCount = this.merchants.length;
      this.merchants = this.merchants.filter(m => 
        !(m.address === address && m.chain === chain)
      );
      
      const removed = initialCount > this.merchants.length;
      if (removed) {
        this.logger.log(`Removed merchant with address ${address} on ${chain}`);
      }
      
      return removed;
    } catch (error) {
      this.logger.error('Failed to remove merchant:', error);
      return false;
    }
  }

  // Get all registered merchants
  getMerchants(): MerchantInfo[] {
    return [...this.merchants];
  }
} 