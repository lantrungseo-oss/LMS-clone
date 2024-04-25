"use client";

import Editor from "@/components/editor";
import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";

type CourseDescriptionProps = {
  description: string;
  title: string;
  imageUrl: string;
}

export const CourseDescription = ({ description, title, imageUrl }: CourseDescriptionProps) => {
  // cover image using image URL
  // for image, can hover to enlarge
  // title
  // description display using react quill
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <img 
          src={imageUrl} 
          alt={title} 
          className="cursor-pointer object-cover w-full h-64" 
          onClick={openModal} 
        />
        <h1 className="text-2xl font-semibold mt-4">{title}</h1>
        <Preview value={description} />
      </div>
      <Dialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        <DialogContent className="p-4 mt-4">
          <DialogHeader>
            <DialogTitle>
              {title}
            </DialogTitle>  
          </DialogHeader>
          <DialogDescription>
            <img src={imageUrl} alt={title} />
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
   
  )
}