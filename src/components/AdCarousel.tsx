"use client";
import { useState, useEffect } from "react";

export default function AdCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="overflow-hidden rounded border">
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Ad ${i}`}
            className="h-48 w-full flex-shrink-0 object-cover"
          />
        ))}
      </div>
    </div>
  );
}
