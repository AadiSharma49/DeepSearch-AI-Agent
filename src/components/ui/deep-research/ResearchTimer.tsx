"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useDeepResearchStore } from "@/store/deepResearch";

function ResearchTimer() {
  const { report, isCompleted, activities } = useDeepResearchStore();
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (activities.length <= 0) {
      setElapsedTime(0);
      return;
    }

    if (report.length > 10) return;

    const startTime = Date.now();
    const timer = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 16);

    return () => clearInterval(timer);
  }, [report, isCompleted, activities]);

  if (activities.length <= 0) return null;

  const seconds = Math.floor(elapsedTime / 1000);
  const milliseconds = elapsedTime % 1000;

  return (
    <Card
      className="
        p-2 rounded
        bg-white/60 text-black border-black/10
        dark:bg-black/60 dark:text-white dark:border-white/10
        backdrop-blur-sm border shadow-none
      "
    >
      <p className="text-sm text-black/70 dark:text-white/70">
        Time elapsed:{" "}
        <span className="font-mono min-w-[55px] inline-block">
          {seconds > 60
            ? `${Math.floor(seconds / 60)}m ${
                seconds % 60 > 0
                  ? `${(seconds % 60).toString().padStart(2, "0")}s`
                  : ""
              }`
            : `${seconds}.${milliseconds
                .toString()
                .padStart(3, "0")}s`}
        </span>
      </p>
    </Card>
  );
}

export default ResearchTimer;
