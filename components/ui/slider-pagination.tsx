"use client";
import { useCallback, useState } from 'react';

export type TSliderPaginationProps = {
  totalSlides: number;
  currentSlide: number;
  onChange?: (slide: number) => void;
};

const SliderPagination = ({ totalSlides, currentSlide, onChange }: TSliderPaginationProps) => {

  const handleChange = useCallback((newValues: number[]) => {
    onChange?.(newValues[0]);
  }, [onChange]);

  return (
    <div className="flex items-center">
      <button
        className="text-gray-400 mr-2"
        disabled={currentSlide <= 0}
        onClick={() => handleChange([currentSlide - 1])}
      >
        {'<'}
      </button>
      <span className="text-gray-400">
        {currentSlide + 1}/{totalSlides}
      </span>
      <button
        className="text-gray-400 ml-2"
        disabled={currentSlide >= totalSlides - 1}
        onClick={() => handleChange([currentSlide + 1])}
      >
        {'>'}
      </button>
    </div>
  );
};

export default SliderPagination;