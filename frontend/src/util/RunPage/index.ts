import React from "react";

export function scrollToBossCompletionTitle(ref: React.RefObject<HTMLDivElement | null>){
  if(ref.current){
    const coords = ref.current.getBoundingClientRect();
    window.scrollTo(window.scrollX, Math.max(coords.y + window.scrollY - 20, 0));
  }
}