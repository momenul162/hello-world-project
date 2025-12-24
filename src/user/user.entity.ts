import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  registerEnumType,
} from '@nestjs/graphql';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Credential } from '../auth/entities/credential.entity';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
registerEnumType(Role, { name: 'Role', description: 'Available user roles' });

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column({ nullable: true, default: Role.USER })
  @Field({ defaultValue: Role.USER })
  role: Role;

  @OneToOne(() => Credential, (credential) => credential.user)
  credential?: Credential;
}

@InputType()
export class CreateUserInput {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  @Field()
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @Field()
  email: string;
}

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @IsOptional()
  @IsNumber({}, { message: 'ID must be a number' })
  @Field(() => Int)
  id: number;

  @IsOptional()
  @IsString()
  @IsEnum(Role)
  @Field(() => Role, { nullable: true })
  role?: Role;
}
