import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

type CoursePageProps = {
  searchParams?: {
    page?: string;
    pageSize?: string;
    titleSearch?: string;
  }
}

const CoursesPage = async ({
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

  const courses = await db.course.findMany({
    where: {
      userId,
      ...searchParams?.titleSearch && {
        title: {
          contains: searchParams.titleSearch,
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: skip,
    take: take,
  });

  const courseCount = await db.course.count({
    where: {
      userId,
      ...searchParams?.titleSearch && {
        title: {
          contains: searchParams?.titleSearch,
        }
      }
    }
  })

  return ( 
    <div className="p-6">
      <DataTable
        columns={columns} data={courses}
        totalPage={Math.ceil(courseCount / pageSize)}
        pagination={{ page, pageSize }}
      />
    </div>
   );
}
 
export default CoursesPage;