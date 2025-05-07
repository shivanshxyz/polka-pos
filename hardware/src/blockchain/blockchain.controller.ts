import { Controller, Post, Get, Body, Delete, Param } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { MerchantDto } from '../dto/merchant.dto';

@Controller('merchants')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post()
  async registerMerchant(@Body() merchantDto: MerchantDto) {
    const success = await this.blockchainService.registerMerchant(merchantDto);
    return { success };
  }

  @Delete(':address/:chain')
  async removeMerchant(
    @Param('address') address: string,
    @Param('chain') chain: string
  ) {
    const success = await this.blockchainService.removeMerchant(address, chain);
    return { success };
  }

  @Get()
  getMerchants() {
    return this.blockchainService.getMerchants();
  }
} 