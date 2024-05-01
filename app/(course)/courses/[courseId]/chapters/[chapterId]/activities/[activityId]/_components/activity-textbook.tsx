"use client";

import { Preview } from "@/components/preview";

type ActivityTextBookProps = {
  value?: string | null;
}

export const ActivityTextBook = ({ value }: ActivityTextBookProps) => {
  // cover image using image URL
  // for image, can hover to enlarge
  // title
  // description display using react quill
  return (
    <>
      <div className="flex flex-col items-center mt-6">
        <Preview value={value ?? "Nothing"} />
      </div>
    </>
  )
}