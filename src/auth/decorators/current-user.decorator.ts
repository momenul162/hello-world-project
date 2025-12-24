import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../../user/user.entity';

interface GqlContext {
  req: {
    user: User;
  };
}

export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext<GqlContext>();
    const user = gqlContext.req.user;

    return data ? user?.[data] : user;
  },
);
