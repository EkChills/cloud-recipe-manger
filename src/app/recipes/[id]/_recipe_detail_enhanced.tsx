"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DeleteRecipeDialog } from "@/components/delete-recipe-dialog"
import { Check, Clock, Users, ChefHat, DollarSign, ArrowLeft, ArrowRight, List } from "lucide-react"
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
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl py-12 mx-auto px-6">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded-lg w-1/3" />
            <div className="h-96 bg-muted rounded-2xl" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-muted rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl py-16 mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold">Recipe not found</h2>
          <Link href="/recipes">
            <Button className="mt-6 h-11 px-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
              Back to recipes
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)

  // Cooking Mode UI
  if (cookingMode && recipe.steps?.length > 0) {
    const sortedSteps = recipe.steps.sort((a: { stepNumber: number }, b: { stepNumber: number }) => a.stepNumber - b.stepNumber)

    return (
      <div className="min-h-screen bg-background p-6 print:hidden">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="outline"
              onClick={() => setCookingMode(false)}
              className="h-11 px-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit cooking mode
            </Button>
            <div className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold shadow-lg">
              Step {currentStep + 1} of {sortedSteps.length}
            </div>
          </div>

          <Card className="border-2 shadow-2xl">
            <CardHeader className="border-b">
              <CardTitle className="text-3xl">{recipe.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-8">
              {/* Current Step */}
              <div className="rounded-2xl border-2 p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                    {currentStep + 1}
                  </div>
                  <p className="text-xl leading-relaxed flex-1 pt-3 font-medium">
                    {sortedSteps[currentStep]?.instruction}
                  </p>
                </div>
                {sortedSteps[currentStep]?.duration && (
                  <div className="flex items-center gap-2 mt-6 ml-22 text-muted-foreground font-semibold">
                    <Clock className="h-5 w-5" />
                    {sortedSteps[currentStep].duration} minutes
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="flex-1 h-14 border-2"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Previous
                </Button>
                <Button
                  size="lg"
                  onClick={() =>
                    setCurrentStep(Math.min(sortedSteps.length - 1, currentStep + 1))
                  }
                  disabled={currentStep === sortedSteps.length - 1}
                  className="flex-1 h-14 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-lg"
                >
                  Next step
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Quick Reference */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">Ingredients quick reference</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {recipe.ingredients?.map((ingredient: { ingredientName: string; quantity: number; unit: string }, index: number) => (
                      <div key={index} className="flex justify-between p-2 rounded-lg border">
                        <span className="font-medium">{ingredient.ingredientName}</span>
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
        <div className="container max-w-7xl py-12 mx-auto px-6">
          {/* Back Button & Actions */}
          <div className="flex items-center justify-between mb-8 no-print">
            <Link href="/recipes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to recipes
            </Link>

            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="h-10 px-4" onClick={handlePrint}>
                Print
              </Button>
              <Button
                size="sm"
                className="h-10 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-lg"
                onClick={() => setCookingMode(true)}
              >
                <ChefHat className="h-4 w-4 mr-2" />
                Start cooking
              </Button>
              <Button variant="outline" size="sm" className="h-10 px-4" asChild>
                <Link href={`/recipes/${recipe.id}/edit`}>
                  Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-red-50 dark:hover:bg-red-950 h-10 px-4"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete
              </Button>
            </div>
          </div>

          {/* Recipe Hero Card */}
          <Card className="border shadow-2xl mb-8 overflow-hidden">
            <div className="relative">
              {/* Recipe Image */}
              {recipe.image && (
                <div className="relative h-[400px] w-full">
                  <Image src={recipe.image} alt={recipe.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  {/* Floating badges on image */}
                  <div className="absolute bottom-6 left-6 flex gap-3">
                    {recipe.category && (
                      <Badge className="bg-white/95 text-gray-900 backdrop-blur-sm text-base px-4 py-2 shadow-lg">
                        {recipe.category}
                      </Badge>
                    )}
                    {recipe.difficulty && (
                      <Badge
                        className={`backdrop-blur-sm text-base px-4 py-2 shadow-lg ${
                          recipe.difficulty === "Easy"
                            ? "bg-green-500/95 text-white"
                            : recipe.difficulty === "Medium"
                            ? "bg-amber-500/95 text-white"
                            : "bg-red-500/95 text-white"
                        }`}
                      >
                        {recipe.difficulty}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <CardContent className="pt-8 pb-8">
                {/* Title & Description */}
                {!recipe.image && (
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {recipe.category && (
                      <Badge variant="secondary" className="text-base px-4 py-2">
                        {recipe.category}
                      </Badge>
                    )}
                    {recipe.difficulty && (
                      <Badge
                        className={`text-base px-4 py-2 ${
                          recipe.difficulty === "Easy"
                            ? "bg-green-500 text-white"
                            : recipe.difficulty === "Medium"
                            ? "bg-amber-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {recipe.difficulty}
                      </Badge>
                    )}
                  </div>
                )}

                <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
                  {recipe.title}
                </h1>

                {recipe.description && (
                  <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl">
                    {recipe.description}
                  </p>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                  {totalTime > 0 && (
                    <div className="p-5 rounded-xl border-2 hover:border-gray-400 dark:hover:border-gray-600 transition-all">
                      <Clock className="h-8 w-8 text-muted-foreground mb-2" />
                      <div className="text-3xl font-bold mb-1">{totalTime}</div>
                      <div className="text-sm text-muted-foreground">minutes</div>
                    </div>
                  )}

                  {recipe.servings && (
                    <div className="p-5 rounded-xl border-2 hover:border-gray-400 dark:hover:border-gray-600 transition-all">
                      <Users className="h-8 w-8 text-muted-foreground mb-2" />
                      <div className="text-3xl font-bold mb-1">{recipe.servings}</div>
                      <div className="text-sm text-muted-foreground">servings</div>
                    </div>
                  )}

                  {recipe.totalCost ? (
                    <div className="p-5 rounded-xl border-2 hover:border-gray-400 dark:hover:border-gray-600 transition-all">
                      <DollarSign className="h-8 w-8 text-muted-foreground mb-2" />
                      <div className="text-3xl font-bold mb-1">₦{recipe.totalCost.toFixed(0)}</div>
                      <div className="text-sm text-muted-foreground">total cost</div>
                    </div>
                  ) : null}

                  {recipe.steps?.length > 0 && (
                    <div className="p-5 rounded-xl border-2 hover:border-gray-400 dark:hover:border-gray-600 transition-all">
                      <List className="h-8 w-8 text-muted-foreground mb-2" />
                      <div className="text-3xl font-bold mb-1">{recipe.steps.length}</div>
                      <div className="text-sm text-muted-foreground">steps</div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {recipe.tags && recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-8">
                    {recipe.tags.map((tag: { tag: string }) => (
                      <Badge key={tag.tag} variant="outline" className="text-sm px-3 py-1">
                        {tag.tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Ingredients */}
            <div className="lg:col-span-2">
              <Card className="sticky top-4 border shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Ingredients</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    <div className="space-y-3">
                      {recipe.ingredients.map((ingredient: { id: string; quantity: number; unit: string; ingredientName: string; notes?: string; calculatedPrice?: number }, index: number) => (
                        <div
                          key={ingredient.id}
                          className="group flex items-start gap-3 p-4 rounded-lg border hover:bg-accent/50 transition-all"
                        >
                          <div className="text-xs text-muted-foreground w-6 flex-shrink-0 mt-0.5">
                            {index + 1}.
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-base">
                              {ingredient.quantity} {ingredient.unit} {ingredient.ingredientName}
                            </p>
                            {ingredient.notes && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {ingredient.notes}
                              </p>
                            )}
                            {ingredient.calculatedPrice && (
                              <p className="text-sm text-muted-foreground mt-1">
                                ₦{ingredient.calculatedPrice.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-12 text-sm">
                      No ingredients added yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Directions */}
            <div className="lg:col-span-3">
              <Card className="border shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Directions</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {recipe.steps && recipe.steps.length > 0 ? (
                    <div className="space-y-4">
                      {recipe.steps
                        .sort((a: { stepNumber: number }, b: { stepNumber: number }) => a.stepNumber - b.stepNumber)
                        .map((step: { id: string; instruction: string; duration?: number }, index: number) => (
                          <div
                            key={step.id}
                            className={`group flex gap-4 p-5 rounded-xl border-2 transition-all ${
                              checkedSteps.has(step.id)
                                ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                                : "hover:bg-accent/50"
                            }`}
                          >
                            <button
                              onClick={() => toggleStep(step.id)}
                              className="flex-shrink-0"
                            >
                              {checkedSteps.has(step.id) ? (
                                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                                  <Check className="h-6 w-6 text-white" />
                                </div>
                              ) : (
                                <div className="h-11 w-11 rounded-xl border-2 flex items-center justify-center font-bold text-lg transition-transform">
                                  {index + 1}
                                </div>
                              )}
                            </button>
                            <div className="flex-1 pt-1">
                              <p
                                className={`text-base leading-relaxed font-medium ${
                                  checkedSteps.has(step.id)
                                    ? "line-through text-muted-foreground"
                                    : ""
                                }`}
                              >
                                {step.instruction}
                              </p>
                              {step.duration && (
                                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  {step.duration} minutes
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-12 text-sm">
                      No directions added yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recipe Info Footer */}
          <Card className="mt-8 border shadow-xl">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Created by</p>
                  <p className="font-semibold text-lg">{recipe.author?.name || "Unknown"}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm text-muted-foreground mb-2">Created on</p>
                  <p className="font-semibold text-lg">
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
