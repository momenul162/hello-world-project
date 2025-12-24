import { Worker, Job } from 'bullmq';
import { redisConnection } from './redis.connection';
import { sendWelcomeEmail } from './email.service';

export const emailWorker = new Worker(
  'email-queue',
  async (job: Job) => {
    console.log(`📧 Processing job ${job.id}: ${job.name}`);
    console.log('Job data:', job.data);

    const { email, name } = job.data as { email: string; name: string };

    if (job.name === 'send-welcome-email') {
      await sendWelcomeEmail(email, name);
    }

    return { success: true, email };
  },
  {
    connection: redisConnection,
  },
);

emailWorker.on('active', (job) => {
  console.log(`🔄 Job ${job.id} is now active`);
});

emailWorker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed successfully`);
});

emailWorker.on('failed', (job, err) => {
  console.log('❌ Job Failed');
  console.log('Job ID:', job?.id);
  console.log('Reason:', err.message);
});
