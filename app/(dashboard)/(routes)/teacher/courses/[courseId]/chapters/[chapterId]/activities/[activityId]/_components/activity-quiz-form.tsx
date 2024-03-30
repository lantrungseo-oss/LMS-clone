"use client";

import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useState } from "react";


export const ActivityQuizForm = () => {
  return (
    <div className="h-100 w-100 grid grid-rows-[1fr_150px] grid-cols-12 grid-flow-col flex-1">
      <div className="w-100 p-2 row-start-1 col-start-1 col-span-7">  
        Content here
      </div>
      <div className="w-100 p-2 row-start-2 col-start-1 col-span-7">
        Slider pagination here
      </div>
      <div className="w-100 p-2 row-start-1 col-start-8 col-span-2">
        Settings and list of questions here
      </div>
    </div>
  )
}