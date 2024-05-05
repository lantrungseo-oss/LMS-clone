"use client";

import Editor from "@/components/editor";
import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";
import { CourseEnrollBanner } from "../../../_components/course-enroll-banner";

type ChapterDescriptionProps = {
  description: string;
  title: string;
  isPurchased: boolean;
  coursePrice?: number | null;
  courseId: string;
}

export const ChapterDescription = ({ description, title, isPurchased, courseId, coursePrice }: ChapterDescriptionProps) => {
  // cover image using image URL
  // for image, can hover to enlarge
  // title
  // description display using react quill
  return (
    <>
      {!isPurchased && coursePrice && (
        <CourseEnrollBanner courseId={courseId} price={coursePrice} />
      )}
      <div className="flex flex-col items-center mt-6">
        <h1 className="text-2xl font-semibold mt-4">{title}</h1>
        <Preview value={description} />
      </div>
    </>
  )
}