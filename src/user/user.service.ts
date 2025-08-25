import { Injectable } from '@nestjs/common';
import { CreateUserInput, UpdateUserInput, User } from './user.type';

@Injectable()
export class UserService {
  private users = [
    { id: 1, name: 'John Doe', email: 'john@gmail.com' },
    { id: 2, name: 'Momenul Islam', email: 'momenul@gmail.com' },
  ];

  create(data: CreateUserInput): User {
    const user = { id: this.users.length + 1, ...data };
    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User | undefined {
    const user = this.users.find((user) => user.id === id);

    if (!user) throw new Error('User not found');

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
