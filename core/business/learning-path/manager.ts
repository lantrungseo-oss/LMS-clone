import { db } from "@/lib/db";

type CreateLearningPathInput = {
  title: string;
  userId: string;
  steps?: {
    description: string;
    courseIds: string[]
  }[];
}

export const createLearningPath = async (input: CreateLearningPathInput) => {
  const learningPlan = await db.learningPlan.create({
    data: {
      title: input.title,
      userId: input.userId
    } 
  })
  if(typeof input.steps === undefined) {
    return learningPlan
  }

  await Promise.all((input.steps ?? []).map(async (step, index) => {
    const createdStep = await db.learningPlanStep.create({
      data: {
        description: step.description,
        learningPlanId: learningPlan.id,
        position: index+1
      }
    })

    await db.learningPlanStepCourse.createMany({
      data: step.courseIds.map(courseId => {
        return {
          courseId,
          learningPlanStepId: createdStep.id
        }
      })
    })
  }))

  return learningPlan;
}

export const editLearningPlan = async (learningPlanId: string) => {

}