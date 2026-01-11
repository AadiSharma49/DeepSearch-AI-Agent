import QnA from "@/components/ui/deep-research/QnA";
import UserInput from "@/components/ui/deep-research/UserInput";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";


export default function Home() {
  return (
      <main className="min-h-screen w-full flex flex-col items-center justify-start gap-8 py-16">
  <ThemeToggle />
  <div className="flex flex-col items-center gap-4">
    <h1 className="text-5xl sm:text-8xl font-bold font-dancing-script italic">
      Deep Search
    </h1>
    <p className="text-gray-600 dark:text-gray-400 text-center max-w-[90vw] sm:max-w-[50vw]">
      Enter a topic and answer a few questions to generate a comprehensive Search report.
    </p>
  </div>

  <UserInput />
  <QnA />
</main>
    
  );
}
