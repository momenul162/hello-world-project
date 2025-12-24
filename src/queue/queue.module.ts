import { Module, OnModuleInit } from '@nestjs/common';
import { emailWorker } from './email.worker';

@Module({})
export class QueueModule implements OnModuleInit {
  onModuleInit() {
    console.log('📬 Queue module initialized, worker is running');
    // Worker is automatically started when imported
    // This ensures the worker runs when the app starts
  }

  async onModuleDestroy() {
    console.log('📬 Shutting down email worker...');
    await emailWorker.close();
  }
}
