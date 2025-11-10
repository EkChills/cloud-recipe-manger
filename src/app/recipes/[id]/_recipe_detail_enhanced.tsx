"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DeleteRecipeDialog } from "@/components/delete-recipe-dialog"
import {
  Clock,
  Users,
  TrendingUp,
  ChefHat,
  Edit,
  Trash2,
  Printer,
  ArrowLeft,
  CheckCircle2,
  Circle,
  ArrowRight,
} from "lucide-react"
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
      <div className="container max-w-5xl py-8 mx-auto px-4">
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
      <div className="container max-w-5xl py-16 mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold">Recipe not found</h2>
        <Link href="/recipes">
          <Button className="mt-4">Back to Recipes</Button>
        </Link>
      </div>
    )
  }

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)

  // Cooking Mode UI
  if (cookingMode && recipe.steps?.length > 0) {
    const sortedSteps = recipe.steps.sort((a: any, b: any) => a.stepNumber - b.stepNumber)

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 p-4 print:hidden">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="outline"
              onClick={() => setCookingMode(false)}
              className="bg-white dark:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit Cooking Mode
            </Button>
            <div className="text-sm text-muted-foreground bg-white dark:bg-gray-800 px-4 py-2 rounded-lg font-semibold">
              Step {currentStep + 1} of {sortedSteps.length}
            </div>
          </div>

          <Card className="border-2 border-orange-200 dark:border-orange-900 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50">
              <CardTitle className="text-2xl">{recipe.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-8">
              {/* Current Step */}
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-950 dark:to-amber-950 rounded-xl p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-600 to-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {currentStep + 1}
                  </div>
                  <p className="text-xl leading-relaxed flex-1 pt-3">
                    {sortedSteps[currentStep]?.instruction}
                  </p>
                </div>
                {sortedSteps[currentStep]?.duration && (
                  <div className="flex items-center gap-2 mt-6 text-orange-600 font-semibold ml-22">
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
                  className="flex-1 h-14"
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
                  className="flex-1 h-14 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                >
                  Next Step
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Quick Reference */}
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-base">Ingredients Quick Reference</CardTitle>
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

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
        <div className="container max-w-6xl py-8 mx-auto px-4">
          {/* Back Button & Actions */}
          <div className="flex items-center justify-between mb-8 no-print">
            <Link href="/recipes">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Recipes
              </Button>
            </Link>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 border-orange-200 dark:border-orange-900"
                onClick={() => setCookingMode(true)}
              >
                <ChefHat className="h-4 w-4 mr-2" />
                Cooking Mode
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/recipes/${recipe.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-red-50 dark:hover:bg-red-950"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Recipe Header */}
          <Card className="border-2 border-orange-200 dark:border-orange-900 shadow-lg mb-8">
            <CardContent className="pt-8">
              <div className="flex flex-col gap-6">
                {/* Title & Badges */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {recipe.category && (
                      <Badge variant="secondary" className="text-base px-4 py-1">
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
                        className="text-base px-4 py-1"
                      >
                        {recipe.difficulty}
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
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
                  <div className="relative h-64 sm:h-96 rounded-xl overflow-hidden">
                    <Image src={recipe.image} alt={recipe.title} fill className="object-cover" />
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {totalTime > 0 && (
                    <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-lg border border-orange-200 dark:border-orange-900">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-orange-600">{totalTime}</p>
                          <p className="text-xs text-muted-foreground">minutes</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {recipe.servings && (
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-600">{recipe.servings}</p>
                          <p className="text-xs text-muted-foreground">servings</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {recipe.totalCost && (
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-900">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">₦{recipe.totalCost.toFixed(0)}</p>
                          <p className="text-xs text-muted-foreground">total cost</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-200 dark:border-purple-900">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                        <ChefHat className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">{recipe.steps?.length || 0}</p>
                        <p className="text-xs text-muted-foreground">steps</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {recipe.tags && recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag: any) => (
                      <Badge key={tag.tag} variant="outline" className="text-sm">
                        {tag.tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Ingredients */}
            <div className="lg:col-span-2">
              <Card className="sticky top-4 border-2 border-orange-200 dark:border-orange-900 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <div className="h-8 w-8 bg-gradient-to-br from-orange-600 to-amber-600 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
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
                          className="flex items-start gap-3 p-3 rounded-lg border-2 border-orange-100 dark:border-orange-900 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-colors"
                        >
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">
                              {ingredient.quantity} {ingredient.unit} {ingredient.ingredientName}
                            </p>
                            {ingredient.notes && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {ingredient.notes}
                              </p>
                            )}
                            {ingredient.calculatedPrice && (
                              <p className="text-xs text-orange-600 font-medium mt-1">
                                ₦{ingredient.calculatedPrice.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No ingredients added yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Directions */}
            <div className="lg:col-span-3">
              <Card className="border-2 border-orange-200 dark:border-orange-900 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                      <ChefHat className="h-4 w-4 text-white" />
                    </div>
                    Cooking Directions
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
                            className={`flex gap-4 p-5 rounded-lg border-2 transition-all ${
                              checkedSteps.has(step.id)
                                ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900"
                                : "border-orange-100 dark:border-orange-900 hover:border-orange-300 dark:hover:border-orange-700"
                            } group`}
                          >
                            <button
                              onClick={() => toggleStep(step.id)}
                              className="flex-shrink-0"
                            >
                              {checkedSteps.has(step.id) ? (
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg">
                                  <CheckCircle2 className="h-6 w-6 text-white" />
                                </div>
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center font-bold text-white text-lg group-hover:scale-110 transition-transform">
                                  {index + 1}
                                </div>
                              )}
                            </button>
                            <div className="flex-1">
                              <p
                                className={`text-base leading-relaxed ${
                                  checkedSteps.has(step.id)
                                    ? "line-through text-muted-foreground"
                                    : ""
                                }`}
                              >
                                {step.instruction}
                              </p>
                              {step.duration && (
                                <div className="flex items-center gap-1 mt-2 text-sm text-orange-600 font-medium">
                                  <Clock className="h-3 w-3" />
                                  {step.duration} minutes
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No directions added yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recipe Info Footer */}
          <Card className="mt-8 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-2 border-orange-200 dark:border-orange-900">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Created by</p>
                  <p className="font-semibold text-lg">{recipe.author?.name || "Unknown"}</p>
                </div>
                <div className="space-y-1 text-left sm:text-right">
                  <p className="text-sm text-muted-foreground">Created on</p>
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
