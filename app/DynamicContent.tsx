"use client"; // Mark as client-side component
import { useEffect, useState } from "react";

export const DynamicContent = () => {
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    setDate(new Date()); // Only on the client-side
  }, []);

  if (!date) return null; // Render nothing on the first server render
  return <div>{date.toString()}</div>; // Render once client-side
};
