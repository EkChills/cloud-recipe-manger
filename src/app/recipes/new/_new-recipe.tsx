"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Ingredient {
  id: string
  name: string
  quantity: number
  unit: string
  notes?: string
  masterId?: string
}

interface Step {
  id: string
  instruction: string
  duration?: number
}

interface RecipeData {
  title: string
  description: string
  category: string
  prepTime?: number
  cookTime?: number
  servings?: number
  difficulty?: string
  image?: string
  ingredients: Ingredient[]
  steps: Step[]
  tags: string[]
}

const CATEGORIES = ["Cake", "Bread", "Pastry", "Candy", "Cookies", "Other"]
const DIFFICULTIES = ["Easy", "Medium", "Hard"]
const UNITS = ["g", "kg", "ml", "l", "cup", "tbsp", "tsp", "piece"]

export default function EnhancedRecipeCreation() {
  const router = useRouter()
  const [recipeData, setRecipeData] = useState<RecipeData>({
    title: "",
    description: "",
    category: "",
    ingredients: [],
    steps: [],
    tags: [],
  })

  const [ingredientSearch, setIngredientSearch] = useState("")
  const [newIngredient, setNewIngredient] = useState<Partial<Ingredient>>({
    name: "",
    quantity: 0,
    unit: "g",
  })

  const [newStep, setNewStep] = useState("")
  const [stepDuration, setStepDuration] = useState<number>()
  const [tagInput, setTagInput] = useState("")

  const { data: ingredientSuggestions } = useQuery({
    queryKey: ["ingredients", ingredientSearch],
    queryFn: async () => {
      if (ingredientSearch.length < 2) return []
      const { data } = await axios.get(`/api/ingredients/search?q=${ingredientSearch}`)
      return data
    },
    enabled: ingredientSearch.length >= 2,
  })

  const { mutate: saveRecipe, isPending } = useMutation({
    mutationFn: async (data: RecipeData) => {
      await axios.post("/api/recipe/save", data)
      return data
    },
    onSuccess: () => {
      toast.success("Recipe created successfully")
      router.push("/recipes")
    },
    onError: () => {
      toast.error("Failed to create recipe")
    },
  })

  const addIngredient = () => {
    if (!newIngredient.name || !newIngredient.quantity) {
      toast.error("Please fill in ingredient name and quantity")
      return
    }

    const ingredient: Ingredient = {
      id: Math.random().toString(),
      name: newIngredient.name,
      quantity: newIngredient.quantity,
      unit: newIngredient.unit || "g",
      notes: newIngredient.notes,
      masterId: newIngredient.masterId,
    }

    setRecipeData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ingredient],
    }))

    setNewIngredient({ name: "", quantity: 0, unit: "g" })
    setIngredientSearch("")
    toast.success("Ingredient added")
  }

  const removeIngredient = (id: string) => {
    setRecipeData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((ing) => ing.id !== id),
    }))
  }

  const addStep = () => {
    if (!newStep.trim()) {
      toast.error("Please enter step instruction")
      return
    }

    const step: Step = {
      id: Math.random().toString(),
      instruction: newStep,
      duration: stepDuration,
    }

    setRecipeData((prev) => ({
      ...prev,
      steps: [...prev.steps, step],
    }))

    setNewStep("")
    setStepDuration(undefined)
    toast.success("Step added")
  }

  const removeStep = (id: string) => {
    setRecipeData((prev) => ({
      ...prev,
      steps: prev.steps.filter((step) => step.id !== id),
    }))
  }

  const addTag = () => {
    if (!tagInput.trim()) return

    if (!recipeData.tags.includes(tagInput.trim())) {
      setRecipeData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setRecipeData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const canSubmit = recipeData.title && recipeData.category && recipeData.ingredients.length > 0 && recipeData.steps.length > 0

  const handleSubmit = () => {
    if (!canSubmit) {
      toast.error("Please complete all required fields")
      return
    }
    saveRecipe(recipeData)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8 mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/recipes" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
            ← Back to recipes
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight">Create recipe</h1>
        </div>

        <div className="space-y-6">
          {/* Basic Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic details</CardTitle>
              <CardDescription className="text-sm">Essential information about your recipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Classic Chocolate Cake"
                  value={recipeData.title}
                  onChange={(e) => setRecipeData({ ...recipeData, title: e.target.value })}
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What makes this recipe special?"
                  rows={3}
                  value={recipeData.description}
                  onChange={(e) => setRecipeData({ ...recipeData, description: e.target.value })}
                  className="resize-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm">Category</Label>
                  <Select
                    value={recipeData.category}
                    onValueChange={(value) => setRecipeData({ ...recipeData, category: value })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-sm">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty" className="text-sm">Difficulty</Label>
                  <Select
                    value={recipeData.difficulty}
                    onValueChange={(value) => setRecipeData({ ...recipeData, difficulty: value })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTIES.map((diff) => (
                        <SelectItem key={diff} value={diff} className="text-sm">
                          {diff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prepTime" className="text-sm">Prep time (min)</Label>
                  <Input
                    id="prepTime"
                    type="number"
                    placeholder="30"
                    value={recipeData.prepTime || ""}
                    onChange={(e) => setRecipeData({ ...recipeData, prepTime: parseInt(e.target.value) || undefined })}
                    className="h-9"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cookTime" className="text-sm">Cook time (min)</Label>
                  <Input
                    id="cookTime"
                    type="number"
                    placeholder="45"
                    value={recipeData.cookTime || ""}
                    onChange={(e) => setRecipeData({ ...recipeData, cookTime: parseInt(e.target.value) || undefined })}
                    className="h-9"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="servings" className="text-sm">Servings</Label>
                  <Input
                    id="servings"
                    type="number"
                    placeholder="4"
                    value={recipeData.servings || ""}
                    onChange={(e) => setRecipeData({ ...recipeData, servings: parseInt(e.target.value) || undefined })}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="h-9"
                  />
                  <Button onClick={addTag} size="sm" className="h-9 px-4">
                    Add
                  </Button>
                </div>
                {recipeData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {recipeData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ingredients ({recipeData.ingredients.length})</CardTitle>
              <CardDescription className="text-sm">What do you need to make this recipe?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-5">
                  <Input
                    placeholder="Name"
                    value={newIngredient.name}
                    onChange={(e) => {
                      setNewIngredient({ ...newIngredient, name: e.target.value })
                      setIngredientSearch(e.target.value)
                    }}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Quantity"
                    value={newIngredient.quantity || ""}
                    onChange={(e) => setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) })}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <Select
                    value={newIngredient.unit}
                    onValueChange={(value) => setNewIngredient({ ...newIngredient, unit: value })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map((unit) => (
                        <SelectItem key={unit} value={unit} className="text-sm">
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Button onClick={addIngredient} size="sm" className="w-full h-9">
                    Add
                  </Button>
                </div>
              </div>

              {recipeData.ingredients.length > 0 && (
                <div className="space-y-2 pt-2">
                  {recipeData.ingredients.map((ingredient, index) => (
                    <div
                      key={ingredient.id}
                      className="flex items-center justify-between p-3 rounded-md border text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-6">{index + 1}.</span>
                        <span className="font-medium">{ingredient.name}</span>
                        <span className="text-muted-foreground">
                          {ingredient.quantity} {ingredient.unit}
                        </span>
                      </div>
                      <button
                        onClick={() => removeIngredient(ingredient.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Directions ({recipeData.steps.length})</CardTitle>
              <CardDescription className="text-sm">Step-by-step instructions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  placeholder="e.g., Preheat the oven to 350°F..."
                  rows={3}
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                  className="resize-none text-sm"
                />
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Duration (min)"
                    value={stepDuration || ""}
                    onChange={(e) => setStepDuration(parseInt(e.target.value) || undefined)}
                    className="h-9 text-sm"
                  />
                  <Button onClick={addStep} size="sm" className="h-9 px-4">
                    Add step
                  </Button>
                </div>
              </div>

              {recipeData.steps.length > 0 && (
                <div className="space-y-2 pt-2">
                  {recipeData.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="flex gap-3 p-3 rounded-md border text-sm"
                    >
                      <span className="text-xs text-muted-foreground font-semibold w-6 flex-shrink-0">
                        {index + 1}.
                      </span>
                      <div className="flex-1">
                        <p>{step.instruction}</p>
                        {step.duration && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {step.duration} minutes
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeStep(step.id)}
                        className="text-muted-foreground hover:text-destructive flex-shrink-0"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4">
            <Link href="/recipes">
              <Button variant="outline" className="h-9 px-4">
                Cancel
              </Button>
            </Link>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isPending}
              className="h-9 px-6"
            >
              {isPending ? "Creating..." : "Create recipe"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
