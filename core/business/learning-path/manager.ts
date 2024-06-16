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

type EditLearningPlanInput = {
  title?: string;
  description: string;
  steps: [
    {
      id?: string;
      description?: string;
      deletedCourses?: {
        id: string;
      }[];
      addedCourses?: {
        id: string;
      }[];
    }
  ]
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

export const editLearningPlan = async (learningPlanId: string, data: EditLearningPlanInput) => {
  return db.$transaction(async (tx) => {
    if(data.title || data.description) {
      await tx.learningPlan.update({
        where: {
          id: learningPlanId
        },
        data: {
          ...(data.title ? { title: data.title } : {}),
          ...(data.description ? { description: data.description } : {})
        }
      })
    }

    const allCurrentSteps = await tx.learningPlanStep.findMany({
      where: {
        learningPlanId: learningPlanId,
      }
    })

    // filter out deleted steps
    const stepsToBeDeleted = allCurrentSteps.filter(step => !data.steps.find(s => s.id === step.id))

    // delete all deleted steps
    await tx.learningPlanStep.deleteMany({
      where: {
        id: {
          in: stepsToBeDeleted.map(step => step.id)
        }
      }
    })

    // update/create the rest of the steps
    await Promise.all(data.steps.map(async (step, index) => {
      if(!step.id) {
        const createdStep = await tx.learningPlanStep.create({
          data: {
            description: step.description ?? '',
            learningPlanId: learningPlanId,
            position: index + 1
          }
        })
    
        await tx.learningPlanStepCourse.createMany({
          data: step.addedCourses?.map(course => {
            return {
              courseId: course.id,
              learningPlanStepId: createdStep.id
            }
          }) ?? []
        })
      }
      if(typeof step.description !== undefined) {
        await tx.learningPlanStep.update({
          where: {
            id: step.id
          },
          data: {
            description: step.description,
            position: index + 1
          }
        })
      }

      if(step.deletedCourses?.length) {
        await tx.learningPlanStepCourse.deleteMany({
          where: {
            learningPlanStepId: step.id,
            courseId: {
              in: step.deletedCourses.map(course => course.id)
            }
          }
        })
      }

      if(step.addedCourses?.length) {
        // add courses
        await tx.learningPlanStepCourse.createMany({
          data: step.addedCourses.map(course => {
            return {
              courseId: course.id,
              learningPlanStepId: step.id ?? ''
            }
          })
        })
      }
    }))
    return {
      success: true
    }
  })
} 