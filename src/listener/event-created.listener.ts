import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { emailQueue } from '../queue/email.queue';
import { User } from 'src/user/user.entity';

@Injectable()
export class UserCreatedListener {
  @OnEvent('user.registered')
  async handleUserCreatedEvent(payload: { user: User }) {
    const { user } = payload;
    console.log('📢 user.registered event received for:', user.email);

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
