import { Injectable } from '@nestjs/common';
import { CreateUserInput, UpdateUserInput, User, Role } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findAll(role?: Role, limit?: number): Promise<User[]> {
    const query = this.userRepo.createQueryBuilder('user');
    if (role) {
      query.andWhere('user.role = :role', { role });
    }
    if (limit && limit > 0) {
      query.limit(limit);
    }
    return await query.getMany();
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new Error('User not found');
    return user;
  }

  async create(data: CreateUserInput): Promise<User> {
    const user = this.userRepo.create({ ...data, role: Role.USER });
    return await this.userRepo.save(user);
  }

  async update(data: UpdateUserInput): Promise<User | null> {
    const user = await this.findOne(data.id);
    if (!user) throw new Error('User not found');
    Object.assign(user, data);
    return await this.userRepo.save(user);
  }

  async remove(id: number): Promise<string> {
    const result = await this.userRepo.delete(id);
    return result.affected && result.affected > 0
      ? 'User removed successfully'
      : 'User not found';
  }
}
