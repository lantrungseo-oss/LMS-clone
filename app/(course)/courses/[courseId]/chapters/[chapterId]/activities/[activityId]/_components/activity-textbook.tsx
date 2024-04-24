"use client";

import Editor from "@/components/editor";
import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";

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