import { mainChapterAdapter } from "@/core/adapters/chapter";
import { ActivityActionValidator } from "./validator";
import { mainCourseAdapter } from "@/core/adapters/course";
import { MainActivityService } from "./main-service";
import { mainActivityAdapter } from "@/core/adapters/activity";

const mainActivityValidator = new ActivityActionValidator(
  mainChapterAdapter, mainCourseAdapter
)

const mainActivityService = new MainActivityService(
  mainActivityAdapter,
  mainActivityValidator,
)

export {
  mainActivityService
}