import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class TtsService {
  private readonly logger = new Logger(TtsService.name);

  /**
   * Speak text using espeak (common on Raspberry Pi)
   */
  async speak(text: string): Promise<void> {
    try {
      // Sanitize the text to prevent command injection
      const sanitizedText = text.replace(/[;&|<>$()`\\]/g, '');
      this.logger.log(`Speaking: ${sanitizedText}`);
      
      // Use espeak for text-to-speech on Raspberry Pi
      await execAsync(`espeak "${sanitizedText}"`);
    } catch (error) {
      this.logger.error('Failed to speak text:', error);
    }
  }
} 