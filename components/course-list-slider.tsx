"use client";

import { CourseCard } from "@/components/course-card";
import { Course } from "@prisma/client";
import { useCallback, useContext, useMemo } from "react";
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './course-list-slider.css'

type CourseListSliderProps = {
  items: Course[];
  header?: React.ReactNode;
}

export const CourseListSlider = ({
  items,
  header,
}: CourseListSliderProps) => {
  const headerComponent = useCallback(() => {
    const visibility = useContext(VisibilityContext);
    const isFirstItemVisible = visibility.useIsVisible(items[0].id, false);
    const isLastItemVisible = visibility.useIsVisible(items[items.length - 1].id, false);

    return (
      <div className="flex justify-between items-center w-full px-4">
        <div className="flex-1">
          {header}
        </div>
        <div>
          {/** Transparent button: LeftArrow */}
          {!isFirstItemVisible && (
            <button className="bg-transparent border-none cursor-pointer" onClick={() => visibility.scrollPrev()}>
              <ArrowLeft className="w-6 h-6"/>
            </button>
          )}
          {!isLastItemVisible && (
            <button className="bg-transparent border-none cursor-pointer ml-4" onClick={() => visibility.scrollNext()}>
              <ArrowRight className="w-6 h-6"/>
            </button>
          )}
        </div>
      </div>
    )
  }, [header, items[0].id, items[items.length - 1].id])
  return (
    <>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No courses found
        </div>
      )}
      {items.length > 0 && (
        <ScrollMenu Header={headerComponent} scrollContainerClassName="hide-scrollbar">
          {items.map((item) => {
            return (
              <div className="w-44 mr-2" key={item.id} {...{itemId: item.id}}>
                <CourseCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  imageUrl={item.imageUrl!}
                  price={item.price!}
                  chaptersLength={0}
                />
              </div>
              
            )
          })}
        </ScrollMenu>
      )}
    </>
  )
}