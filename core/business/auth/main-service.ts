import { auth } from '@clerk/nextjs';
import * as authBusinessType from './types';

export class MainAuthService {
  async getAuthContext(input: authBusinessType.IGetAuthContextInput): Promise<authBusinessType.IAuthContext> {
    const { userId } = auth();
    return {
      userId
    }
  }
}