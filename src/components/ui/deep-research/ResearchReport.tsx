"use client";

import { useDeepResearchStore } from "@/store/deepResearch";
import React, { ComponentPropsWithRef } from "react";
import { Card } from "../card";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Prism as SyntaxHighlighter,
  SyntaxHighlighterProps,
} from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Download } from "lucide-react";
import { Button } from "../button";

type CodeProps = ComponentPropsWithRef<"code"> & {
  inline?: boolean;
};

const ResearchReport = () => {
  const { report, isCompleted, isLoading, topic } = useDeepResearchStore();

  const handleMarkdownDownload = () => {
    const content = report.split("<report>")[1].split("</report>")[0];
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic}-research-report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isCompleted) return null;

  if (report.length <= 0 && isLoading) {
    return (
      <Card
        className="
          p-6 max-w-[60vw] rounded-xl
          bg-white/60 text-black border-black/10
          dark:bg-black/60 dark:text-white dark:border-white/10
          backdrop-blur-xl border
        "
      >
        <div className="flex flex-col items-center justify-center space-y-4 p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-black/60 dark:text-white/60">
            Researching your topic...
          </p>
        </div>
      </Card>
    );
  }

  if (report.length <= 0) return null;

  return (
    <Card
      className="
        max-w-[90vw] xl:max-w-[60vw] relative p-6 rounded-xl
        bg-white/60 text-black border-black/10
        dark:bg-black/60 dark:text-white dark:border-white/10
        backdrop-blur-xl border shadow-none
      "
    >
      {/* Download button */}
      <div className="flex justify-end gap-2 mb-4 absolute top-4 right-4">
        <Button
          size="sm"
          onClick={handleMarkdownDownload}
          className="
            flex items-center gap-2 rounded
            bg-black text-white
            dark:bg-white dark:text-black
            hover:opacity-90 transition
          "
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>

      {/* Markdown content */}
      <div
        className="
          prose prose-sm md:prose-base max-w-none
          prose-pre:p-2 overflow-x-auto
          prose-headings:text-black dark:prose-headings:text-white
          prose-p:text-black/80 dark:prose-p:text-white/80
          prose-li:text-black/80 dark:prose-li:text-white/80
        "
      >
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, inline, ...props }: CodeProps) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";

              if (!inline && language) {
                const propsHL: SyntaxHighlighterProps = {
                  style: nightOwl,
                  language,
                  PreTag: "div",
                  children: String(children).replace(/\n$/, ""),
                };
                return <SyntaxHighlighter {...propsHL} />;
              }

              return (
                <code
                  className="bg-black/10 dark:bg-white/90 px-1 rounded"
                  {...props}
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {report.split("<report>")[1].split("</report>")[0]}
        </Markdown>
      </div>
    </Card>
  );
};

export default ResearchReport;
