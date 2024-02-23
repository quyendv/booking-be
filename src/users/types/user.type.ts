import { RoleTypes } from '../constants/user.constant';

export type CurrentAccountInfo = {
  id: string | number; // hotel: int, customer/admin: email
  email: string;
  isVerify: boolean;
  role: RoleTypes;
  name: string;
  avatar?: string;
};
