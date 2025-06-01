"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Details } from "@/lib/models"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  title: z.string().min(1, { message: "Recipe title is required" }),
  description: z.string().optional(),
  category: z.string().min(1, { message: "Please select a category" }),
})

export function RecipeForm({ onNext}: { onNext: (data: Details) => void}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onNext(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipe Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter recipe title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your recipe (optional)" className="min-h-[120px]" {...field} />
              </FormControl>
              <FormDescription>Share what makes this recipe special</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipe Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cake">Cake</SelectItem>
                  <SelectItem value="candy">Candy</SelectItem>
                  <SelectItem value="pastry">Pastry</SelectItem>
                  <SelectItem value="bread">Bread</SelectItem>
                  <SelectItem value="cookie">Cookie</SelectItem>
                  <SelectItem value="pie">Pie</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg">
            Next
          </Button>
        </div>
      </form>
    </Form>
  )
}
