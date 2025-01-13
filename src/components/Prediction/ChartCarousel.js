import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ChartCarousel = ({ activeIndex, setActiveIndex, children }) => {
  const slides = React.Children.toArray(children);

  const prev = () => {
    setActiveIndex((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
  };

  const next = () => {
    setActiveIndex((curr) => (curr === slides.length - 1 ? 0 : curr + 1));
  };

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-lg">
        {slides[activeIndex]}
      </div>
      
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg hover:bg-white transition-all"
      >
        <ChevronLeft className="h-6 w-6 text-[#00b8e4]" />
      </button>
      
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg hover:bg-white transition-all"
      >
        <ChevronRight className="h-6 w-6 text-[#00b8e4]" />
      </button>
    </div>
  );
};
