import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  registerEnumType,
} from '@nestjs/graphql';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
registerEnumType(Role, { name: 'Role', description: 'Available user roles' });

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => Role)
  role: Role;
}

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  email: string;
}

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => Int)
  id: number;

  @Field(() => Role, { nullable: true })
  role?: Role;
}
