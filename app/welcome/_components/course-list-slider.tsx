"use client";

import { CourseCard } from "@/components/course-card";
import { Course } from "@prisma/client";
import { ScrollMenu } from 'react-horizontal-scrolling-menu';

export const CourseListSlider = ({
  items
}: {
  items: Course[];
}) => {
  return (
    <>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No courses found
        </div>
      )}
      {items.length > 0 && (
        <ScrollMenu>
          {items.map((item) => {
            return (
              <div style={{ width: '150px' }} key={item.id} {...{itemId: item.id}}>
                <CourseCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  imageUrl={item.imageUrl!}
                  price={item.price!}
                  chaptersLength={0}
                  {...{itemId: item.id}}
                />
              </div>
              
            )
          })}
        </ScrollMenu>
      )}
    </>
  )
}