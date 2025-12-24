import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, Role } from '../user/user.entity';
import { Credential } from './entities/credential.entity';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './dto/auth-response';
import { JwtPayload } from './strategies/jwt.strategy';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Credential)
    private readonly credentialRepo: Repository<Credential>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
    private eventEmitter: EventEmitter2,
  ) {}

  async register(registerInput: RegisterInput): Promise<AuthResponse> {
    const { email, name, password } = registerInput;

    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = this.userRepo.create({
        email,
        name,
        role: Role.USER,
      });
      const savedUser = await queryRunner.manager.save(user);

      const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);
      const credential = this.credentialRepo.create({
        userId: savedUser.id,
        passwordHash,
      });
      await queryRunner.manager.save(credential);

      await queryRunner.commitTransaction();

      const accessToken = this.generateToken(savedUser);

      this.eventEmitter.emit('user.registered', { user: savedUser });

      return { accessToken, user: savedUser };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const credential = await this.credentialRepo.findOne({
      where: { userId: user.id },
    });
    if (!credential) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      credential.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateToken(user);

    return { accessToken, user };
  }

  private generateToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  async validateUser(userId: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id: userId } });
  }
}
