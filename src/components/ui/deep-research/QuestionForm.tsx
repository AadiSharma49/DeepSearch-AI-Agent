import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDeepResearchStore } from "@/store/deepResearch";

const formSchema = z.object({
  answer: z.string().min(1, "Answer is required!"),
});

const QuestionForm = () => {
  const {
    questions,
    currentQuestion,
    answers,
    setCurrentQuestion,
    setAnswers,
    setIsCompleted,
    isLoading,
    isCompleted,
  } = useDeepResearchStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: answers[currentQuestion] || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = values.answer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      form.reset();
    } else {
      setIsCompleted(true);
    }
  }

  if (isCompleted || questions.length === 0) return null;

  return (
    <Card
      className="
        w-full max-w-[90vw] sm:max-w-[80vw] xl:max-w-[50vw]
        bg-white text-black border-black/10
        dark:bg-black dark:text-white dark:border-white/10
        backdrop-blur-sm shadow-none rounded-xl px-4 py-6
      "
    >
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-base text-black/60 dark:text-white/60">
          Question {currentQuestion + 1} of {questions.length}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 w-full px-4 sm:px-6">
        <p className="text-base text-black dark:text-white">
          {questions[currentQuestion]}
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Type your answer here..."
                      className="
                        px-4 py-2 text-base resize-none
                        bg-white text-black border-black/20
                        dark:bg-black dark:text-white dark:border-white/20
                        placeholder:text-black/40 dark:placeholder:text-white/40
                      "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-between items-center mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (currentQuestion > 0) {
                    setCurrentQuestion(currentQuestion - 1);
                    form.setValue(
                      "answer",
                      answers[currentQuestion - 1] || ""
                    );
                  }
                }}
                className="
                  cursor-pointer
                  border-black text-black
                  dark:border-white dark:text-white
                  hover:bg-black hover:text-white
                  dark:hover:bg-white dark:hover:text-black
                  transition-colors
                "
              >
                Previous
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                className="
                  cursor-pointer
                  bg-black text-white
                  dark:bg-white dark:text-black
                  hover:opacity-90
                  transition-colors
                "
              >
                {currentQuestion === questions.length - 1
                  ? "Start Research"
                  : "Next"}
              </Button>
            </div>
          </form>
        </Form>

        {/* Progress bar */}
        <div className="h-1 w-full bg-black/10 dark:bg-white/20 rounded">
          <div
            className="h-1 bg-black dark:bg-white rounded transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionForm;
