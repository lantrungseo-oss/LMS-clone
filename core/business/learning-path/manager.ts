import { db } from "@/lib/db";

type CreateLearningPathInput = {
  title: string;
  userId: string;
  description: string;
  steps?: {
    description: string;
    courseIds: string[]
  }[];
}

export const createLearningPath = async (input: CreateLearningPathInput) => {
  return db.$transaction(async (tx) => {
    const learningPlan = await tx.learningPlan.create({
      data: {
        title: input.title,
        userId: input.userId,
        description: input.description
      } 
    })
    if(typeof input.steps === undefined) {
      return learningPlan
    }
  
    await Promise.all((input.steps ?? []).map(async (step, index) => {
      const createdStep = await tx.learningPlanStep.create({
        data: {
          description: step.description,
          learningPlanId: learningPlan.id,
          position: index+1
        }
      })
  
      await tx.learningPlanStepCourse.createMany({
        data: step.courseIds.map(courseId => {
          return {
            courseId,
            learningPlanStepId: createdStep.id
          }
        })
      })
    }))
  
    return learningPlan;
  })
}

export const editLearningPlan = async (learningPlanId: string) => {

}