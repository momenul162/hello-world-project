import { Injectable } from '@nestjs/common';
import { CreateUserInput, UpdateUserInput, User, Role } from './user.type';

@Injectable()
export class UserService {
  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@gmail.com', role: Role.USER },
    {
      id: 2,
      name: 'Momenul Islam',
      email: 'momenul@gmail.com',
      role: Role.ADMIN,
    },
    {
      id: 3,
      name: 'Test user1',
      email: 'test1@gmail.com',
      role: Role.USER,
    },
    {
      id: 4,
      name: 'Test user2',
      email: 'test2@gmail.com',
      role: Role.USER,
    },
    {
      id: 5,
      name: 'Test user3',
      email: 'test3@gmail.com',
      role: Role.USER,
    },
    {
      id: 6,
      name: 'Test user4',
      email: 'test4@gmail.com',
      role: Role.USER,
    },
  ];

  findAll(role?: Role, limit?: number): User[] {
    let result = this.users;
    if (typeof role !== 'undefined' && role !== null) {
      result = result.filter((u) => u.role === role);
    }
    if (limit && limit > 0) {
      result = result.slice(0, limit);
    }
    return result;
  }

  findOne(id: number): User | undefined {
    const user = this.users.find((user) => user.id === id);

    if (!user) throw new Error('User not found');

    return user;
  }

  create(data: CreateUserInput): User {
    const user: User = {
      id: this.users.length ? Math.max(...this.users.map((u) => u.id)) + 1 : 1,
      ...data,
      role: Role.USER,
    };
    this.users.push(user);
    return user;
  }

  update(data: UpdateUserInput): User | null {
    const user = this.findOne(data.id);

    if (!user) throw new Error('User not found');

    Object.assign(user, data);
    return user;
  }

  remove(id: number): String {
    const before = this.users.length;
    this.users = this.users.filter((user) => user.id !== id);

    return this.users.length < before
      ? 'User removed successfully'
      : 'User not found';
  }
}
