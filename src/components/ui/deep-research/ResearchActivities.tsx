"use client";

import { useDeepResearchStore } from "@/store/deepResearch";
import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "../button";
import { ChevronDown } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { format } from "date-fns";
import Link from "next/link";

const ResearchActivities = () => {
  const { activities, sources } = useDeepResearchStore();
  const [isOpen, setIsOpen] = useState(true);

  if (activities.length === 0) return null;

  return (
    <div className="w-[90vw] sm:w-[400px] fixed top-4 right-4 z-20">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {/* Arrow Toggle ONLY */}
        <div className="flex justify-end mb-2">
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="
                w-9 p-0
                border-black text-black
                dark:border-white dark:text-white
              "
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="h-[50vh]">
          {/* Tabs ALWAYS default to activities */}
          <Tabs defaultValue="activities" className="w-full h-full">
            
            {/* Activities – AUTO SHOWN */}
            <TabsContent
              value="activities"
              className="
                h-full overflow-y-auto
                bg-white/60 dark:bg-black/60
                text-black dark:text-white
                backdrop-blur-sm border
                border-black/10 dark:border-white/10
                rounded-xl
              "
            >
              <ul className="space-y-4 p-4">
                {activities.map((activity, index) => (
                  <li
                    key={index}
                    className="
                      flex flex-col gap-2
                      border-b border-black/10 dark:border-white/10
                      p-2 text-sm
                    "
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`${
                          activity.status === "complete"
                            ? "bg-green-500"
                            : activity.status === "error"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        } min-w-2 min-h-2 h-2 rounded-full`}
                      />
                      <p>
                        {activity.message.includes("https://")
                          ? activity.message.split("https://")[0] +
                            activity.message.split("https://")[1].split("/")[0]
                          : activity.message}
                      </p>
                    </div>

                    {activity.timestamp && (
                      <span className="text-xs text-black/60 dark:text-white/60">
                        {format(activity.timestamp, "HH:mm:ss")}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </TabsContent>

            {/* Sources – OPTIONAL */}
            {sources.length > 0 && (
              <TabsContent
                value="sources"
                className="
                  h-full overflow-y-auto
                  bg-white/60 dark:bg-black/60
                  backdrop-blur-sm border
                  border-black/10 dark:border-white/10
                  rounded-xl
                "
              >
                <ul className="space-y-4 p-4">
                  {sources.map((source, index) => (
                    <li
                      key={index}
                      className="border-b border-black/10 dark:border-white/10 p-2"
                    >
                      <Link
                        href={source.url}
                        target="_blank"
                        className="
                          text-sm text-blue-600
                          dark:text-blue-400
                          hover:underline
                        "
                      >
                        {source.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            )}
          </Tabs>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ResearchActivities;
