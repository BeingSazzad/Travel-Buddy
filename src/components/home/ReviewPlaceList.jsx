import React from "react";
import ReviewPlaceListItem from "./ReviewPlaceListItem";

export default function ReviewPlaceList({ items, onItemClick, className = "" }) {
  if (!items?.length) return null;
  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, i) => (
        <ReviewPlaceListItem key={`${item.type}-${item.title}-${i}`} item={item} onClick={() => onItemClick(item)} />
      ))}
    </div>
  );
}
