"use client";

import { Loader } from "lucide-react";

export const BasicLoader = () => {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center w-100 h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500">
      <Loader className='w-10 h-10'/>
    </div>
  </div>
  )
  
}