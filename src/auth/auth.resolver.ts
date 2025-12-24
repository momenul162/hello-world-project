import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './dto/auth-response';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../user/user.entity';
import { emailQueue } from 'src/queue/email.queue';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => AuthResponse)
  async register(
    @Args('registerInput') registerInput: RegisterInput,
  ): Promise<AuthResponse> {
    const user = this.authService.register(registerInput);
    await emailQueue.add(
      'send-welcome-email',
      {
        email: (await user).user.email,
        name: (await user).user.name,
      },
      {
        delay: 10000, // 10 seconds
        attempts: 3, // total try = 3
        backoff: {
          type: 'fixed',
          delay: 5000, // retry gap = 5 sec
        },
      },
    );

    return user;
  }

  @Public()
  @Mutation(() => AuthResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Query(() => User)
  me(@CurrentUser() user: User): User {
    return user;
  }
}
