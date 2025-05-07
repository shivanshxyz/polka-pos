import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockchainModule } from './blockchain/blockchain.module';
import { TtsModule } from './tts/tts.module';

@Module({
  imports: [BlockchainModule, TtsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
