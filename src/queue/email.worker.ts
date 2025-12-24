import { Worker } from 'bullmq';
import { redisConnection } from './redis.connection';

new Worker(
  'email-queue',
  () => {
    throw new Error('Email service down');
  },
  {
    connection: redisConnection,
  },
).on('failed', (job, err) => {
  console.log('❌ Job Failed');
  console.log('Job ID:', job?.id);
  console.log('Reason:', err.message);
});
