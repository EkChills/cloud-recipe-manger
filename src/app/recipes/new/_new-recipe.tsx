"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, X, ChefHat, Clock, Users, TrendingUp, Trash2, GripVertical } from "lucide-react"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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
  const [activeTab, setActiveTab] = useState("details")
  const [recipeData, setRecipeData] = useState<RecipeData>({
    title: "",
    description: "",
    category: "",
    ingredients: [],
    steps: [],
    tags: [],
  })

  // Ingredient form state
  const [ingredientSearch, setIngredientSearch] = useState("")
  const [newIngredient, setNewIngredient] = useState<Partial<Ingredient>>({
    name: "",
    quantity: 0,
    unit: "g",
  })

  // Step form state
  const [newStep, setNewStep] = useState("")
  const [stepDuration, setStepDuration] = useState<number>()

  // Tag state
  const [tagInput, setTagInput] = useState("")

  // Search ingredients for autocomplete
  const { data: ingredientSuggestions } = useQuery({
    queryKey: ["ingredients", ingredientSearch],
    queryFn: async () => {
      if (ingredientSearch.length < 2) return []
      const { data } = await axios.get(`/api/ingredients/search?q=${ingredientSearch}`)
      return data
    },
    enabled: ingredientSearch.length >= 2,
  })

  // Save recipe mutation
  const { mutate: saveRecipe, isPending } = useMutation({
    mutationFn: async (data: RecipeData) => {
      await axios.post("/api/recipe/save", data)
      return data
    },
    onSuccess: () => {
      toast.success("Recipe created successfully!")
      router.push("/recipes")
    },
    onError: () => {
      toast.error("Failed to create recipe. Please try again.")
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
    toast.success("Ingredient added!")
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
    toast.success("Step added!")
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

  const canProceedToIngredients = recipeData.title && recipeData.category
  const canProceedToDirections = recipeData.ingredients.length > 0
  const canSubmit = recipeData.steps.length > 0

  const handleSubmit = () => {
    if (!canSubmit) {
      toast.error("Please add at least one step")
      return
    }
    saveRecipe(recipeData)
  }

  return (
    <div className="container max-w-5xl py-8 mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ChefHat className="h-8 w-8 text-primary" />
          Create New Recipe
        </h1>
        <p className="text-muted-foreground mt-2">
          Build your recipe step by step with our guided creation flow
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="details" className="gap-2">
            <span className="hidden sm:inline">Recipe</span> Details
          </TabsTrigger>
          <TabsTrigger value="ingredients" disabled={!canProceedToIngredients} className="gap-2">
            Ingredients
          </TabsTrigger>
          <TabsTrigger value="directions" disabled={!canProceedToDirections} className="gap-2">
            Directions
          </TabsTrigger>
        </TabsList>

        {/* DETAILS TAB */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Start with the essential details of your recipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Recipe Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Classic Chocolate Cake"
                  value={recipeData.title}
                  onChange={(e) => setRecipeData({ ...recipeData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What makes this recipe special?"
                  rows={4}
                  value={recipeData.description}
                  onChange={(e) => setRecipeData({ ...recipeData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={recipeData.category}
                    onValueChange={(value) => setRecipeData({ ...recipeData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={recipeData.difficulty}
                    onValueChange={(value) => setRecipeData({ ...recipeData, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTIES.map((diff) => (
                        <SelectItem key={diff} value={diff}>
                          {diff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prepTime" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Prep Time (min)
                  </Label>
                  <Input
                    id="prepTime"
                    type="number"
                    placeholder="30"
                    value={recipeData.prepTime || ""}
                    onChange={(e) =>
                      setRecipeData({ ...recipeData, prepTime: parseInt(e.target.value) || undefined })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cookTime" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Cook Time (min)
                  </Label>
                  <Input
                    id="cookTime"
                    type="number"
                    placeholder="45"
                    value={recipeData.cookTime || ""}
                    onChange={(e) =>
                      setRecipeData({ ...recipeData, cookTime: parseInt(e.target.value) || undefined })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="servings" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Servings
                  </Label>
                  <Input
                    id="servings"
                    type="number"
                    placeholder="8"
                    value={recipeData.servings || ""}
                    onChange={(e) =>
                      setRecipeData({ ...recipeData, servings: parseInt(e.target.value) || undefined })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag (e.g., vegan, quick)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag} variant="secondary">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {recipeData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {recipeData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={() => setActiveTab("ingredients")}
              disabled={!canProceedToIngredients}
              size="lg"
            >
              Continue to Ingredients
            </Button>
          </div>
        </TabsContent>

        {/* INGREDIENTS TAB */}
        <TabsContent value="ingredients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Ingredients</CardTitle>
              <CardDescription>
                Start typing to search our ingredient database or add your own
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-5 space-y-2">
                  <Label htmlFor="ingredientName">Ingredient Name</Label>
                  <div className="relative">
                    <Input
                      id="ingredientName"
                      placeholder="Search or type ingredient..."
                      value={ingredientSearch}
                      onChange={(e) => {
                        setIngredientSearch(e.target.value)
                        setNewIngredient({ ...newIngredient, name: e.target.value })
                      }}
                    />
                    {ingredientSuggestions && ingredientSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto">
                        {ingredientSuggestions.map((ing: any) => (
                          <button
                            key={ing.id}
                            type="button"
                            className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground text-sm"
                            onClick={() => {
                              setNewIngredient({
                                ...newIngredient,
                                name: ing.name,
                                unit: ing.defaultUnit,
                                masterId: ing.id,
                              })
                              setIngredientSearch(ing.name)
                            }}
                          >
                            <div className="font-medium">{ing.name}</div>
                            {ing.category && (
                              <div className="text-xs text-muted-foreground">{ing.category}</div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-3 space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={newIngredient.quantity || ""}
                    onChange={(e) =>
                      setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) })
                    }
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select
                    value={newIngredient.unit}
                    onValueChange={(value) => setNewIngredient({ ...newIngredient, unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 flex items-end">
                  <Button type="button" onClick={addIngredient} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  placeholder="e.g., sifted, room temperature"
                  value={newIngredient.notes || ""}
                  onChange={(e) => setNewIngredient({ ...newIngredient, notes: e.target.value })}
                />
              </div>

              {recipeData.ingredients.length > 0 && (
                <div className="space-y-2 pt-4 border-t">
                  <Label>Ingredients List ({recipeData.ingredients.length})</Label>
                  <div className="space-y-2">
                    {recipeData.ingredients.map((ing, index) => (
                      <div
                        key={ing.id}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="font-medium">
                            {ing.quantity} {ing.unit} {ing.name}
                          </div>
                          {ing.notes && (
                            <div className="text-xs text-muted-foreground">{ing.notes}</div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeIngredient(ing.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("details")}>
              Back
            </Button>
            <Button
              onClick={() => setActiveTab("directions")}
              disabled={!canProceedToDirections}
              size="lg"
            >
              Continue to Directions
            </Button>
          </div>
        </TabsContent>

        {/* DIRECTIONS TAB */}
        <TabsContent value="directions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cooking Directions</CardTitle>
              <CardDescription>Add step-by-step instructions for your recipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stepInstruction">Step Instruction</Label>
                  <Textarea
                    id="stepInstruction"
                    placeholder="Describe what to do in this step..."
                    rows={3}
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="stepDuration">Duration (optional, in minutes)</Label>
                    <Input
                      id="stepDuration"
                      type="number"
                      placeholder="5"
                      value={stepDuration || ""}
                      onChange={(e) =>
                        setStepDuration(parseInt(e.target.value) || undefined)
                      }
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="button" onClick={addStep}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Step
                    </Button>
                  </div>
                </div>
              </div>

              {recipeData.steps.length > 0 && (
                <div className="space-y-2 pt-4 border-t">
                  <Label>Recipe Steps ({recipeData.steps.length})</Label>
                  <div className="space-y-3">
                    {recipeData.steps.map((step, index) => (
                      <div
                        key={step.id}
                        className="flex gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{step.instruction}</p>
                          {step.duration && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {step.duration} minutes
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeStep(step.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("ingredients")}>
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isPending}
              size="lg"
              className="gap-2"
            >
              {isPending ? "Creating..." : "Create Recipe"}
              <TrendingUp className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}