import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserInput, UpdateUserInput, User } from './user.entity';
import { Role } from './user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async users(
    @Args('role', { type: () => Role, nullable: true }) role?: Role,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    return await this.userService.findAll(role, limit);
  }

  @Query(() => User, { nullable: true })
  async user(@Args('id', { type: () => Int }, ParseIntPipe) id: number) {
    return await this.userService.findOne(id);
  }

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.userService.create(createUserInput);
  }

  @Mutation(() => User, { nullable: true })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return await this.userService.update(updateUserInput);
  }

  @Mutation(() => String)
  async removeUser(@Args('id', { type: () => Int }, ParseIntPipe) id: number) {
    return await this.userService.remove(id);
  }
}
