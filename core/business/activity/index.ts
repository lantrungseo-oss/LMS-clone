import { mainChapterAdapter } from "@/core/adapters/chapter";
import { ActivityActionValidator } from "./validator";
import { mainCourseAdapter } from "@/core/adapters/course";
import { MainActivityService } from "./main-service";
import { mainActivityAdapter } from "@/core/adapters/activity";
import { ActivityVideoService } from "./activity-video.service";
import { mainMuxDataRepo } from "@/core/adapters/mux-data";

const mainActivityValidator = new ActivityActionValidator(
  mainChapterAdapter, mainCourseAdapter, mainActivityAdapter
)

const activityVideoService = new ActivityVideoService(
  mainMuxDataRepo
)

const mainActivityService = new MainActivityService(
  mainActivityAdapter,
  mainActivityValidator,
  activityVideoService
)

export {
  mainActivityService
}