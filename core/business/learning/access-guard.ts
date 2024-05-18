import type * as learningType from './types';
import { ECourseAccessRole } from './types';

export class CourseAccessGuard implements learningType.ICourseAccessGuard {
  constructor(
    private readonly couresRepo: learningType.CourseRepo,
    private readonly purchaseRepo: learningType.PurchaseRepo,
    private readonly authService: learningType.AuthService
  ) {}

  async checkCourseAccess(courseId: string, options: learningType.ICheckCourseAccessOptions): Promise<learningType.CheckCourseAccessResult> {
    const { userId } = await this.authService.getAuthContext({});
    if(!userId) {
      return {};
    }
    const doesCourseBelongToUser = await this.couresRepo.doesCourseBelongToUser(courseId, userId);
    if(!doesCourseBelongToUser) {
      const purchase = await this.purchaseRepo.getPurchase(userId, courseId);
      if(purchase) {
        return { userId, grantedAccessRole: ECourseAccessRole.STUDENT };
      }
      return { userId, }
    }
    return {
      userId,
      grantedAccessRole: ECourseAccessRole.TEACHER // owner of the course
    }
  }
}