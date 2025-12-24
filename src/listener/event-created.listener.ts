import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { emailQueue } from '../queue/email.queue';
import { User } from 'src/user/user.entity';

@Injectable()
export class UserCreatedListener {
  @OnEvent('user.created')
  async handleUserCreatedEvent(user: User) {
    console.log('📢 user.created event received');

    await emailQueue.add(
      'send-welcome-email',
      {
        email: user.email,
        name: user.name,
      },
      {
        delay: 10000,
        attempts: 3,
      },
    );
  }
}
