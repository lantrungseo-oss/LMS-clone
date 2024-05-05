"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { Banner } from "@/components/banner";

interface CourseEnrollBannerProps {
  price: number;
  courseId: string;
}


export const CourseEnrollBanner = ({
  price,
  courseId,
}: CourseEnrollBannerProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const startPurchase = async () => {
    
    try {
      setIsLoading(true);

      const response = await axios.post(`/api/courses/${courseId}/checkout`)

      window.location.assign(response.data.url);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Banner variant='info' label={
      (<div>
        <Button variant={'link'} className="underline" onClick={startPurchase}>Enroll now</Button>
        for {formatPrice(price)}
      </div>)
    } />
  )
}