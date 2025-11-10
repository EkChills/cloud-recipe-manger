"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  Users,
  TrendingUp,
  ChefHat,
  Edit,
  Trash2,
  Share2,
  Printer,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface RecipeDetailProps {
  recipeId: string
}

export default function RecipeDetail({ recipeId }: RecipeDetailProps) {
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set())

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

  return (
    <div className="container max-w-5xl py-8 mx-auto px-4">
      {/* Back Button */}
      <Link href="/recipes">
        <Button variant="ghost" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Recipes
        </Button>
      </Link>

      {/* Recipe Header */}
      <div className="space-y-6">
        {/* Title and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{recipe.category}</Badge>
              {recipe.difficulty && (
                <Badge
                  variant={
                    recipe.difficulty === "Easy"
                      ? "default"
                      : recipe.difficulty === "Medium"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {recipe.difficulty}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">{recipe.title}</h1>
            {recipe.description && (
              <p className="text-muted-foreground text-lg">{recipe.description}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>

        {/* Recipe Image */}
        <div className="relative h-64 sm:h-96 rounded-xl overflow-hidden bg-gradient-to-br from-orange-100 to-pink-100">
          {recipe.image ? (
            <Image src={recipe.image} alt={recipe.title} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-50">
              <ChefHat className="h-32 w-32 text-primary" />
            </div>
          )}
        </div>

        {/* Recipe Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {totalTime > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalTime}</p>
                    <p className="text-xs text-muted-foreground">minutes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {recipe.servings && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{recipe.servings}</p>
                    <p className="text-xs text-muted-foreground">servings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {recipe.totalCost ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">₦{recipe.totalCost.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">total cost</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ): null}

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <ChefHat className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{recipe.steps?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">steps</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag: any) => (
              <Badge key={tag.tag} variant="outline">
                {tag.tag}
              </Badge>
            ))}
          </div>
        )}

        <Separator />

        {/* Ingredients and Directions */}
        <Tabs defaultValue="ingredients" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ingredients">
              Ingredients ({recipe.ingredients?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="directions">
              Directions ({recipe.steps?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ingredients" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                  <div className="space-y-3">
                    {recipe.ingredients.map((ingredient: any) => (
                      <div
                        key={ingredient.id}
                        className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                      >
                        <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
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
                  <p className="text-muted-foreground text-center py-8">
                    No ingredients added yet
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="directions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Cooking Directions</CardTitle>
              </CardHeader>
              <CardContent>
                {recipe.steps && recipe.steps.length > 0 ? (
                  <div className="space-y-4">
                    {recipe.steps
                      .sort((a: any, b: any) => a.stepNumber - b.stepNumber)
                      .map((step: any, index: number) => (
                        <div
                          key={step.id}
                          className={`flex gap-4 p-4 rounded-lg border transition-all ${
                            checkedSteps.has(step.id)
                              ? "bg-primary/5 border-primary/20"
                              : "hover:bg-accent/50"
                          }`}
                        >
                          <button
                            onClick={() => toggleStep(step.id)}
                            className="flex-shrink-0"
                          >
                            {checkedSteps.has(step.id) ? (
                              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5" />
                              </div>
                            ) : (
                              <div className="h-8 w-8 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center font-semibold text-muted-foreground">
                                {index + 1}
                              </div>
                            )}
                          </button>
                          <div className="flex-1">
                            <p
                              className={`${
                                checkedSteps.has(step.id)
                                  ? "line-through text-muted-foreground"
                                  : ""
                              }`}
                            >
                              {step.instruction}
                            </p>
                            {step.duration && (
                              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
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
          </TabsContent>
        </Tabs>

        {/* Recipe Info Footer */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Created by</p>
                <p className="font-medium">{recipe.author?.name || "Unknown"}</p>
              </div>
              <div className="space-y-1 text-left sm:text-right">
                <p className="text-sm text-muted-foreground">Created on</p>
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
  )
}