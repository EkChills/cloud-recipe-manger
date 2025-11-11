"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DeleteRecipeDialog } from "@/components/delete-recipe-dialog"
import { Check, Clock, Users, ChefHat, DollarSign, ArrowLeft, ArrowRight } from "lucide-react"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
        <div className="container max-w-7xl py-12 mx-auto px-6">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-lg w-1/3" />
            <div className="h-96 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-2xl" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
        <div className="container max-w-7xl py-16 mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold">Recipe not found</h2>
          <Link href="/recipes">
            <Button className="mt-6 h-11 px-6">Back to recipes</Button>
          </Link>
        </div>
      </div>
    )
  }

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)

  // Cooking Mode UI
  if (cookingMode && recipe.steps?.length > 0) {
    const sortedSteps = recipe.steps.sort((a: any, b: any) => a.stepNumber - b.stepNumber)

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 p-6 print:hidden">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="outline"
              onClick={() => setCookingMode(false)}
              className="h-11 px-6 border-2 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit cooking mode
            </Button>
            <div className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg">
              Step {currentStep + 1} of {sortedSteps.length}
            </div>
          </div>

          <Card className="border-2 border-blue-200 dark:border-blue-900 shadow-2xl backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
              <CardTitle className="text-3xl">{recipe.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-8">
              {/* Current Step */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50 p-8 border-2 border-blue-200 dark:border-blue-900">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                    {currentStep + 1}
                  </div>
                  <p className="text-xl leading-relaxed flex-1 pt-3 font-medium">
                    {sortedSteps[currentStep]?.instruction}
                  </p>
                </div>
                {sortedSteps[currentStep]?.duration && (
                  <div className="flex items-center gap-2 mt-6 ml-22 text-blue-700 dark:text-blue-400 font-semibold">
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
                  className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                >
                  Next step
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Quick Reference */}
              <Card className="border-2 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-lg">Ingredients quick reference</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {recipe.ingredients?.map((ingredient: any, index: number) => (
                      <div key={index} className="flex justify-between p-2 rounded-lg bg-white/80 dark:bg-gray-800/80">
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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
        <div className="container max-w-7xl py-12 mx-auto px-6">
          {/* Back Button & Actions */}
          <div className="flex items-center justify-between mb-8 no-print">
            <Link href="/recipes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to recipes
            </Link>

            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="h-10 px-4 border-2" onClick={handlePrint}>
                Print
              </Button>
              <Button
                size="sm"
                className="h-10 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                onClick={() => setCookingMode(true)}
              >
                <ChefHat className="h-4 w-4 mr-2" />
                Start cooking
              </Button>
              <Button variant="outline" size="sm" className="h-10 px-4 border-2" asChild>
                <Link href={`/recipes/${recipe.id}/edit`}>
                  Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-red-50 dark:hover:bg-red-950 h-10 px-4 border-2 border-red-200 dark:border-red-900"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete
              </Button>
            </div>
          </div>

          {/* Recipe Hero Card */}
          <Card className="border-2 border-blue-200/50 dark:border-blue-900/50 shadow-2xl backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 mb-8 overflow-hidden">
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

                <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
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
                    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-5 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <Clock className="h-8 w-8 text-white/80 mb-2" />
                        <div className="text-3xl font-bold text-white mb-1">{totalTime}</div>
                        <div className="text-sm text-white/80 font-medium">minutes</div>
                      </div>
                    </div>
                  )}

                  {recipe.servings && (
                    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-5 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <Users className="h-8 w-8 text-white/80 mb-2" />
                        <div className="text-3xl font-bold text-white mb-1">{recipe.servings}</div>
                        <div className="text-sm text-white/80 font-medium">servings</div>
                      </div>
                    </div>
                  )}

                  {recipe.totalCost && (
                    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <DollarSign className="h-8 w-8 text-white/80 mb-2" />
                        <div className="text-3xl font-bold text-white mb-1">₦{recipe.totalCost.toFixed(0)}</div>
                        <div className="text-sm text-white/80 font-medium">total cost</div>
                      </div>
                    </div>
                  )}

                  <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-5 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <ChefHat className="h-8 w-8 text-white/80 mb-2" />
                      <div className="text-3xl font-bold text-white mb-1">{recipe.steps?.length || 0}</div>
                      <div className="text-sm text-white/80 font-medium">steps</div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {recipe.tags && recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-8">
                    {recipe.tags.map((tag: any) => (
                      <Badge key={tag.tag} variant="outline" className="text-sm px-3 py-1 border-2">
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
              <Card className="sticky top-4 border-2 border-blue-200/50 dark:border-blue-900/50 shadow-xl backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-b">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                      <ChefHat className="h-5 w-5 text-white" />
                    </div>
                    Ingredients
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    <div className="space-y-3">
                      {recipe.ingredients.map((ingredient: any, index: number) => (
                        <div
                          key={ingredient.id}
                          className="group flex items-start gap-3 p-4 rounded-xl border-2 border-blue-100 dark:border-blue-900/50 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all"
                        >
                          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5 shadow-md">
                            {index + 1}
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
                              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">
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
              <Card className="border-2 border-blue-200/50 dark:border-blue-900/50 shadow-xl backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-b">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                      <ChefHat className="h-5 w-5 text-white" />
                    </div>
                    Cooking directions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {recipe.steps && recipe.steps.length > 0 ? (
                    <div className="space-y-4">
                      {recipe.steps
                        .sort((a: any, b: any) => a.stepNumber - b.stepNumber)
                        .map((step: any, index: number) => (
                          <div
                            key={step.id}
                            className={`group flex gap-4 p-5 rounded-xl border-2 transition-all ${
                              checkedSteps.has(step.id)
                                ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                                : "border-indigo-100 dark:border-indigo-900/50 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20"
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
                                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-lg group-hover:scale-110 transition-transform shadow-lg">
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
                                <div className="flex items-center gap-2 mt-3 text-sm text-indigo-600 dark:text-indigo-400 font-medium">
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
          <Card className="mt-8 border-2 border-blue-200/50 dark:border-blue-900/50 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 shadow-xl">
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
