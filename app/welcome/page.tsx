"use client";
import React, { useState } from "react";
import { PlusCircle } from 'lucide-react';
import { Popover, Content as PopoverContent, PopoverTrigger,  } from '@radix-ui/react-popover';
import { Check } from 'lucide-react'; 

// Mock data for courses
const courses = [
  { id: 1, title: 'Introduction to Programming' },
  { id: 2, title: 'Web Development Basics' },
  { id: 3, title: 'Data Structures and Algorithms' },
  { id: 4, title: 'Machine Learning Fundamentals' },
  // Add more courses as needed
];

const OnboardingPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Function to filter courses based on input value
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-3xl font-semibold mb-4">Welcome to Our Learning Platform!</h1>
        <input
          type="text"
          placeholder="Enter your request/desire..."
          className="w-full border border-gray-300 rounded-md p-2 mb-4"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Popover
          onOpenChange={isOpen => setIsOpen(isOpen)}
          open={isOpen}
        >
          <PopoverTrigger className="w-full bg-blue-500 text-white py-2 rounded-md text-lg flex items-center justify-center focus:outline-none">
            <span>Find Courses</span>
            <PlusCircle className="w-6 h-6 ml-2" />
          </PopoverTrigger>
          <PopoverContent className="bg-white shadow-md rounded-md border border-gray-200 w-96">
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <div key={course.id}>
                  <button className="flex items-center justify-between px-4 py-2 w-full text-left hover:bg-gray-100 focus:outline-none">
                    {course.title}
                    <Check className="w-5 h-5 text-green-500" />
                  </button>
                </div>
              ))
            ) : (
              <div>
                <div className="px-4 py-2 w-full text-left">No courses found</div>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default OnboardingPage;
