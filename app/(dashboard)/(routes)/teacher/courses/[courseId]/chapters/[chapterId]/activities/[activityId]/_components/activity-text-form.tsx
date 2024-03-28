"use client";

import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useState } from "react";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export const ActivityTextForm = () => {
  const [value, setValue] = useState("");
  return (
    <div className="w-100 text-center">
      <Editor 
        value={value}
        onChange={setValue}
        imageEnabled={true}
      />
      <Button
        className="mt-4"
        disabled={true}
        type="submit"
      >
        Save
      </Button>
    </div>
  )
}