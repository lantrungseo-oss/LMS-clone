import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import LearningPlanDetailsForm from './_components/detail-form'

// Mock data for courses

type DetailsPageProps = {
  params: {
    learningPathId: string;
  }
}

const DetailsPage = async ({
  params
}: DetailsPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const learningPlan = await db.learningPlan.findUnique({
    where: {
      userId,
      id: params.learningPathId
    },
    include: {
      steps: {
        include: {
          stepCourses: {
            include: {
              course: true,
            }
          }
        }
      }
    }
  });

  if (!learningPlan) {
    return redirect('/learning-plans')
  }

  return <LearningPlanDetailsForm learningPlan={learningPlan} />

};

export default DetailsPage;
