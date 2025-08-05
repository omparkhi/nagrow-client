import React, { useState, useEffect, useRef } from "react";
import CategoryItem from "./CategoryItem";
import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const UserDashCategory = () => {
  const scrollRef = useRef(null);

  const scroll = (scrollOffset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollOffset, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="w-full h-auto mt-39 p-0 md:p-6">
        <div className="text-sm font-semibold text-gray-500 px-4 md:px-0">
          What's in your mind?
        </div>

        {/* left scroll button */}
        <div className="relative mt-1">
          <button
            onClick={() => scroll(-200)}
            className="flex items-center justify-center absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md px-3 py-2 z-10"
          >
            <FiChevronLeft size={20} />
          </button>
          {/* Scrollable Categories */}
          <div
            ref={scrollRef}
            className=" flex overflow-x-auto whitespace-nowrap scroll-smooth px-8 gap-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {CategoryItem.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform min-w-[70px] lg:min-w-[100px]"
              >
                <div className="items-center rounded-full">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-17 w-17 sm:h-22 sm:w-22 md:h-27 md:w-27 lg:h-30 lg:w-30 object-contain"
                  />
                  <p className="-mt-3 text-sm text-[#515966ff] font-bold text-center">
                    {item.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll(200)} // Scroll right by 200px
            className="flex items-center justify-center absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md  px-3 py-2 z-10"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default UserDashCategory;
