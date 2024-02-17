import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: UserPayload;
}

export interface UserPayload {
  // uid: string;
  email: string;
  picture?: string;
  name?: string;
}
