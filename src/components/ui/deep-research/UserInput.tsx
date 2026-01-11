"use client";
import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { useDeepResearchStore } from "@/store/deepResearch";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  input: z.string().min(2).max(200),
});

const UserInput = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setQuestions, setTopic } = useDeepResearchStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { input: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        body: JSON.stringify({ topic: values.input }),
      });
      const data = await response.json();
      setTopic(values.input);
      setQuestions(data.questions);
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row items-center justify-center gap-4
                   w-[90vw] sm:w-[80vw] xl:w-[50vw]"
      >
        <FormField
          control={form.control}
          name="input"
          render={({ field }) => (
            <FormItem className="flex-1 w-full">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter your Search topic"
                  disabled={isLoading}
                  className="
                    rounded-full w-full flex-1
                    p-4 sm:py-6 text-base
                    bg-white/70 text-black
                    dark:bg-black/70 dark:text-white
                    border border-black/10 dark:border-white/20
                    placeholder:text-black/70 dark:placeholder:text-white/70
                    backdrop-blur-md shadow-none
                    focus:outline-none focus-visible:ring-2
                    focus-visible:ring-black/20
                    dark:focus-visible:ring-white/30
                    transition-colors
                  "
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="
            rounded-full px-6 h-12
            bg-black text-white
            dark:bg-white dark:text-black
            hover:opacity-90
            cursor-pointer
            transition-colors
          "
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default UserInput;
