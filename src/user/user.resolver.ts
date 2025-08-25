import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserInput, UpdateUserInput, User } from './user.type';
import { Role } from './user.type';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  users(
    @Args('role', { type: () => Role, nullable: true }) role?: Role,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    return this.userService.findAll(role, limit);
  }

  @Query(() => User, { nullable: true })
  user(@Args('id', { type: () => Int }, ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Mutation(() => User, { nullable: true })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput);
  }

  @Mutation(() => String)
  removeUser(@Args('id', { type: () => Int }, ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
