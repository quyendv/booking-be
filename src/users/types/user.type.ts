import { RoleTypes } from '../constants/user.constant';

export type AccountInfo = {
  // id: string | number; // hotel: int, customer/admin: email
  email: string;
  isVerified: boolean;
  role: RoleTypes;
  name: string;
  avatar?: string;
};
