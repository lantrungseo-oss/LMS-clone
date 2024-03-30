"use client";
import { useCallback, useState } from 'react';

export type TSliderPaginationProps = {
  totalSlides: number;
  currentSlide: number;
  onChange?: (slide: number) => void;
};

const SliderPagination = ({ totalSlides, currentSlide, onChange }: TSliderPaginationProps) => {
  const [sliderValue, setSliderValue] = useState(currentSlide);

  const handleChange = useCallback((newValues: number[]) => {
    setSliderValue(newValues[0]);
    console.log(newValues)
    onChange?.(newValues[0]);
  }, [onChange]);

  return (
    <div className="flex items-center">
      <button
        className="text-gray-400 mr-2"
        disabled={sliderValue <= 0}
        onClick={() => handleChange([sliderValue - 1])}
      >
        {'<'}
      </button>
      <span className="text-gray-400">
        {sliderValue + 1}/{totalSlides}
      </span>
      <button
        className="text-gray-400 ml-2"
        disabled={sliderValue >= totalSlides - 1}
        onClick={() => handleChange([sliderValue + 1])}
      >
        {'>'}
      </button>
    </div>
  );
};

export default SliderPagination;