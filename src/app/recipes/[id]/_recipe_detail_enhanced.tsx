"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DeleteRecipeDialog } from "@/components/delete-recipe-dialog"
import { Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface RecipeDetailProps {
  recipeId: string
}

export default function RecipeDetail({ recipeId }: RecipeDetailProps) {
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set())
  const [cookingMode, setCookingMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { data: recipe, isLoading } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/recipes/${recipeId}`)
      return data
    },
  })

  const toggleStep = (stepId: string) => {
    setCheckedSteps((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(stepId)) {
        newSet.delete(stepId)
      } else {
        newSet.add(stepId)
      }
      return newSet
    })
  }

  const handlePrint = () => {
    window.print()
  }

  if (isLoading) {
    return (
      <div className="container max-w-6xl py-8 mx-auto px-6">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-64 bg-muted rounded" />
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded w-1/4" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="container max-w-6xl py-16 mx-auto px-6 text-center">
        <h2 className="text-2xl font-semibold">Recipe not found</h2>
        <Link href="/recipes">
          <Button className="mt-4 h-9 px-4 text-sm">Back to recipes</Button>
        </Link>
      </div>
    )
  }

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)

  // Cooking Mode UI
  if (cookingMode && recipe.steps?.length > 0) {
    const sortedSteps = recipe.steps.sort((a: any, b: any) => a.stepNumber - b.stepNumber)

    return (
      <div className="min-h-screen bg-background p-6 print:hidden">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="outline"
              onClick={() => setCookingMode(false)}
              className="h-9 px-4 text-sm"
            >
              ← Exit cooking mode
            </Button>
            <div className="text-sm text-muted-foreground font-medium">
              Step {currentStep + 1} of {sortedSteps.length}
            </div>
          </div>

          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">{recipe.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              {/* Current Step */}
              <div className="border-2 rounded-lg p-6">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-14 h-14 border-2 rounded-full flex items-center justify-center text-foreground text-xl font-semibold">
                    {currentStep + 1}
                  </div>
                  <p className="text-lg leading-relaxed flex-1 pt-2">
                    {sortedSteps[currentStep]?.instruction}
                  </p>
                </div>
                {sortedSteps[currentStep]?.duration && (
                  <div className="text-sm text-muted-foreground mt-4 ml-20">
                    {sortedSteps[currentStep].duration} minutes
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="flex-1 h-10"
                >
                  ← Previous
                </Button>
                <Button
                  onClick={() =>
                    setCurrentStep(Math.min(sortedSteps.length - 1, currentStep + 1))
                  }
                  disabled={currentStep === sortedSteps.length - 1}
                  className="flex-1 h-10"
                >
                  Next step →
                </Button>
              </div>

              {/* Quick Reference */}
              <Card className="border">
                <CardHeader>
                  <CardTitle className="text-base">Ingredients reference</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {recipe.ingredients?.map((ingredient: any, index: number) => (
                      <div key={index} className="flex justify-between">
                        <span>{ingredient.ingredientName}</span>
                        <span className="text-muted-foreground">
                          {ingredient.quantity} {ingredient.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Normal View
  return (
    <>
      <style jsx global>{`
        @media print {
          header,
          nav,
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl py-8 mx-auto px-6">
          {/* Back Button & Actions */}
          <div className="flex items-center justify-between mb-8 no-print">
            <Link href="/recipes" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to recipes
            </Link>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-9 px-3 text-sm" onClick={handlePrint}>
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 text-sm"
                onClick={() => setCookingMode(true)}
              >
                Cooking mode
              </Button>
              <Button variant="outline" size="sm" className="h-9 px-3 text-sm" asChild>
                <Link href={`/recipes/${recipe.id}/edit`}>
                  Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-red-50 dark:hover:bg-red-950 h-9 px-3 text-sm"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete
              </Button>
            </div>
          </div>

          {/* Recipe Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {recipe.category && (
                <Badge variant="secondary" className="text-sm">
                  {recipe.category}
                </Badge>
              )}
              {recipe.difficulty && (
                <Badge
                  variant={
                    recipe.difficulty === "Easy"
                      ? "default"
                      : recipe.difficulty === "Medium"
                      ? "secondary"
                      : "destructive"
                  }
                  className="text-sm"
                >
                  {recipe.difficulty}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
              {recipe.title}
            </h1>
            {recipe.description && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {recipe.description}
              </p>
            )}
          </div>

          {/* Recipe Image */}
          {recipe.image && (
            <div className="relative h-64 sm:h-96 rounded-lg overflow-hidden mb-8 border">
              <Image src={recipe.image} alt={recipe.title} fill className="object-cover" />
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {totalTime > 0 && (
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-semibold mb-1">{totalTime} min</div>
                <div className="text-sm text-muted-foreground">Total time</div>
              </div>
            )}

            {recipe.servings && (
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-semibold mb-1">{recipe.servings}</div>
                <div className="text-sm text-muted-foreground">Servings</div>
              </div>
            )}

            {recipe.totalCost && (
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-semibold mb-1">₦{recipe.totalCost.toFixed(0)}</div>
                <div className="text-sm text-muted-foreground">Total cost</div>
              </div>
            )}

            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-semibold mb-1">{recipe.steps?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Steps</div>
            </div>
          </div>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {recipe.tags.map((tag: any) => (
                <Badge key={tag.tag} variant="outline" className="text-sm">
                  {tag.tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Ingredients */}
            <div className="lg:col-span-2">
              <Card className="sticky top-4 border">
                <CardHeader>
                  <CardTitle className="text-xl">Ingredients</CardTitle>
                </CardHeader>
                <CardContent>
                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    <div className="space-y-3">
                      {recipe.ingredients.map((ingredient: any, index: number) => (
                        <div
                          key={ingredient.id}
                          className="flex items-start gap-3 p-3 rounded-md border text-sm"
                        >
                          <div className="text-xs text-muted-foreground w-6 flex-shrink-0 mt-0.5">
                            {index + 1}.
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">
                              {ingredient.quantity} {ingredient.unit} {ingredient.ingredientName}
                            </p>
                            {ingredient.notes && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {ingredient.notes}
                              </p>
                            )}
                            {ingredient.calculatedPrice && (
                              <p className="text-xs text-muted-foreground mt-1">
                                ₦{ingredient.calculatedPrice.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8 text-sm">
                      No ingredients added yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Directions */}
            <div className="lg:col-span-3">
              <Card className="border">
                <CardHeader>
                  <CardTitle className="text-xl">Directions</CardTitle>
                </CardHeader>
                <CardContent>
                  {recipe.steps && recipe.steps.length > 0 ? (
                    <div className="space-y-3">
                      {recipe.steps
                        .sort((a: any, b: any) => a.stepNumber - b.stepNumber)
                        .map((step: any, index: number) => (
                          <div
                            key={step.id}
                            className={`flex gap-3 p-4 rounded-md border transition-colors ${
                              checkedSteps.has(step.id)
                                ? "bg-muted/50 border-muted-foreground/20"
                                : "hover:bg-accent/50"
                            }`}
                          >
                            <button
                              onClick={() => toggleStep(step.id)}
                              className="flex-shrink-0"
                            >
                              {checkedSteps.has(step.id) ? (
                                <div className="h-8 w-8 rounded-full border-2 border-foreground flex items-center justify-center">
                                  <Check className="h-4 w-4" />
                                </div>
                              ) : (
                                <div className="h-8 w-8 rounded-full border-2 flex items-center justify-center font-semibold text-sm">
                                  {index + 1}
                                </div>
                              )}
                            </button>
                            <div className="flex-1 pt-1">
                              <p
                                className={`text-sm leading-relaxed ${
                                  checkedSteps.has(step.id)
                                    ? "line-through text-muted-foreground"
                                    : ""
                                }`}
                              >
                                {step.instruction}
                              </p>
                              {step.duration && (
                                <div className="text-xs text-muted-foreground mt-2">
                                  {step.duration} minutes
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8 text-sm">
                      No directions added yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recipe Info Footer */}
          <Card className="mt-8 border">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Created by</p>
                  <p className="font-medium">{recipe.author?.name || "Unknown"}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-muted-foreground mb-1">Created on</p>
                  <p className="font-medium">
                    {new Date(recipe.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteRecipeDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        recipeId={recipe.id}
        recipeTitle={recipe.title}
      />
    </>
  )
}
