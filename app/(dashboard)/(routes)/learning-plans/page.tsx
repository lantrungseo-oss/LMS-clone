import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { Prisma } from "@prisma/client";

type CoursePageProps = {
  searchParams?: {
    page?: string;
    pageSize?: string;
    searchStr?: string;
  }
}

const ListPage = async ({
  searchParams
}: CoursePageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const page = parseInt(searchParams?.page || "1", 10);
  const pageSize = parseInt(searchParams?.pageSize || "20", 10);

  const take = pageSize > 0 ? pageSize : 20;
  const skip = page <= 0 ? 0 : (page - 1) * take;

  const whereClause = {
    AND: [
      {
        userId: userId,
      },
      ...searchParams?.searchStr ? [{
        OR: [
          {
            title: {
              contains: searchParams.searchStr,
            }
          },
          {
            description: {
              contains: searchParams.searchStr,
            }
          }
        ]
      }]: []
    ]
  }

  const fetchedLearningPlans = await db.learningPlan.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
    skip: skip,
    take: take,
  });

  const rawSql = Prisma.sql`
    select
      lp.id as learningPlanId,
      count(*) as courseCount
    from LearningPlanStepCourse lpsc, LearningPlanStep lps, LearningPlan lp
    where lpsc.learningPlanStepId = lps.id and lps.learningPlanId = lp.id and lp.id in (${Prisma.join(fetchedLearningPlans.map(lp => lp.id))})
    group by lp.id
  `;


  const countData = await db.$queryRaw<{learningPlanId: string; courseCount: BigInt}[]>(
    rawSql
  ).then(data => Object.fromEntries(data.map(row => [row.learningPlanId, row.courseCount])));


  const learningPlans = fetchedLearningPlans.map(lp => {
    return {
      ...lp,
      courseCount: countData[lp.id] ? Number(countData[lp.id]) : 0
    }
  })

  const learningPlanCount = await db.learningPlan.count({
    where: whereClause,
  })
  

  return ( 
    <div className="p-6">
      <DataTable
        columns={columns} data={learningPlans}
        totalPage={Math.ceil(learningPlanCount / pageSize)}
        pagination={{ page, pageSize }}
        searchStr={searchParams?.searchStr}
      />
    </div>
   );
}
 
export default ListPage