import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  //(data?: string, ctx: ExecutionContext) fire exception A required parameter cannot follow an optional parameter. => data: string | undefined
  (
    data: string | undefined,
    ctx: ExecutionContext,
  ) => {
    const request = ctx
      .switchToHttp()
      .getRequest();
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
