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
import { Plus, X, ChefHat, Clock, Users, TrendingUp, Trash2, GripVertical, ArrowRight, ArrowLeft, Check } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="container max-w-5xl py-8 mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center shadow-lg">
              <ChefHat className="h-7 w-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Create New Recipe
              </h1>
              <p className="text-muted-foreground text-sm">
                Build your masterpiece step by step
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
              activeTab === "details"
                ? "bg-gradient-to-br from-orange-600 to-amber-600 text-white shadow-lg scale-110"
                : canProceedToIngredients
                ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300"
                : "bg-gray-200 dark:bg-gray-800 text-gray-500"
            }`}>
              {canProceedToIngredients && activeTab !== "details" ? <Check className="h-5 w-5" /> : "1"}
            </div>
            <span className={`text-sm font-medium hidden sm:inline ${activeTab === "details" ? "text-orange-600" : ""}`}>
              Details
            </span>
          </div>

          <div className="h-0.5 w-12 bg-gray-300 dark:bg-gray-700" />

          <div className="flex items-center gap-2">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
              activeTab === "ingredients"
                ? "bg-gradient-to-br from-orange-600 to-amber-600 text-white shadow-lg scale-110"
                : canProceedToDirections
                ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300"
                : "bg-gray-200 dark:bg-gray-800 text-gray-500"
            }`}>
              {canProceedToDirections && activeTab !== "ingredients" ? <Check className="h-5 w-5" /> : "2"}
            </div>
            <span className={`text-sm font-medium hidden sm:inline ${activeTab === "ingredients" ? "text-orange-600" : ""}`}>
              Ingredients
            </span>
          </div>

          <div className="h-0.5 w-12 bg-gray-300 dark:bg-gray-700" />

          <div className="flex items-center gap-2">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
              activeTab === "directions"
                ? "bg-gradient-to-br from-orange-600 to-amber-600 text-white shadow-lg scale-110"
                : canSubmit
                ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300"
                : "bg-gray-200 dark:bg-gray-800 text-gray-500"
            }`}>
              {canSubmit && activeTab === "details" ? <Check className="h-5 w-5" /> : "3"}
            </div>
            <span className={`text-sm font-medium hidden sm:inline ${activeTab === "directions" ? "text-orange-600" : ""}`}>
              Directions
            </span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* DETAILS TAB */}
          <TabsContent value="details" className="space-y-6 mt-0">
            <Card className="border-2 border-orange-200 dark:border-orange-900 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 border-b">
                <CardTitle className="text-2xl">Basic Information</CardTitle>
                <CardDescription>Tell us about your delicious creation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-semibold">Recipe Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Classic Chocolate Cake"
                    value={recipeData.title}
                    onChange={(e) => setRecipeData({ ...recipeData, title: e.target.value })}
                    className="h-12 text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-semibold">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="What makes this recipe special?"
                    rows={4}
                    value={recipeData.description}
                    onChange={(e) => setRecipeData({ ...recipeData, description: e.target.value })}
                    className="resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-base font-semibold">Category *</Label>
                    <Select
                      value={recipeData.category}
                      onValueChange={(value) => setRecipeData({ ...recipeData, category: value })}
                    >
                      <SelectTrigger className="h-12">
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
                    <Label htmlFor="difficulty" className="text-base font-semibold">Difficulty</Label>
                    <Select
                      value={recipeData.difficulty}
                      onValueChange={(value) => setRecipeData({ ...recipeData, difficulty: value })}
                    >
                      <SelectTrigger className="h-12">
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
                    <Label htmlFor="prepTime" className="flex items-center gap-2 font-semibold">
                      <Clock className="h-4 w-4 text-orange-600" />
                      Prep Time (min)
                    </Label>
                    <Input
                      id="prepTime"
                      type="number"
                      placeholder="30"
                      value={recipeData.prepTime || ""}
                      onChange={(e) => setRecipeData({ ...recipeData, prepTime: parseInt(e.target.value) || undefined })}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cookTime" className="flex items-center gap-2 font-semibold">
                      <Clock className="h-4 w-4 text-orange-600" />
                      Cook Time (min)
                    </Label>
                    <Input
                      id="cookTime"
                      type="number"
                      placeholder="45"
                      value={recipeData.cookTime || ""}
                      onChange={(e) => setRecipeData({ ...recipeData, cookTime: parseInt(e.target.value) || undefined })}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="servings" className="flex items-center gap-2 font-semibold">
                      <Users className="h-4 w-4 text-orange-600" />
                      Servings
                    </Label>
                    <Input
                      id="servings"
                      type="number"
                      placeholder="4"
                      value={recipeData.servings || ""}
                      onChange={(e) => setRecipeData({ ...recipeData, servings: parseInt(e.target.value) || undefined })}
                      className="h-12"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag (e.g., vegetarian, quick, dessert)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      className="h-12"
                    />
                    <Button
                      onClick={addTag}
                      className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {recipeData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {recipeData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="pl-3 pr-1 py-1 text-sm">
                          {tag}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 ml-1"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
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
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
              >
                Next: Add Ingredients
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </TabsContent>

          {/* INGREDIENTS TAB */}
          <TabsContent value="ingredients" className="space-y-6 mt-0">
            <Card className="border-2 border-orange-200 dark:border-orange-900 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 border-b">
                <CardTitle className="text-2xl">Ingredients</CardTitle>
                <CardDescription>What do we need to make this recipe?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Add Ingredient Form */}
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg border-2 border-dashed">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5">
                      <Label htmlFor="ingredientName">Ingredient Name</Label>
                      <Input
                        id="ingredientName"
                        placeholder="e.g., All-purpose flour"
                        value={newIngredient.name}
                        onChange={(e) => {
                          setNewIngredient({ ...newIngredient, name: e.target.value })
                          setIngredientSearch(e.target.value)
                        }}
                      />
                    </div>
                    <div className="md:col-span-3">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        step="0.1"
                        placeholder="250"
                        value={newIngredient.quantity || ""}
                        onChange={(e) => setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="md:col-span-2">
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
                      <Button
                        onClick={addIngredient}
                        className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Ingredients List */}
                {recipeData.ingredients.length > 0 ? (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      Added Ingredients ({recipeData.ingredients.length})
                    </Label>
                    {recipeData.ingredients.map((ingredient, index) => (
                      <div
                        key={ingredient.id}
                        className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-orange-100 dark:border-orange-900 hover:border-orange-300 dark:hover:border-orange-700 transition-all group"
                      >
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{ingredient.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {ingredient.quantity} {ingredient.unit}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950"
                          onClick={() => removeIngredient(ingredient.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-lg">No ingredients added yet</p>
                    <p className="text-sm">Add your first ingredient above</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                onClick={() => setActiveTab("details")}
                variant="outline"
                size="lg"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back
              </Button>
              <Button
                onClick={() => setActiveTab("directions")}
                disabled={!canProceedToDirections}
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
              >
                Next: Add Directions
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </TabsContent>

          {/* DIRECTIONS TAB */}
          <TabsContent value="directions" className="space-y-6 mt-0">
            <Card className="border-2 border-orange-200 dark:border-orange-900 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 border-b">
                <CardTitle className="text-2xl">Cooking Directions</CardTitle>
                <CardDescription>Step-by-step instructions to create your recipe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Add Step Form */}
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg border-2 border-dashed">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="stepInstruction">Instruction</Label>
                      <Textarea
                        id="stepInstruction"
                        placeholder="e.g., Preheat the oven to 350°F (175°C)..."
                        rows={3}
                        value={newStep}
                        onChange={(e) => setNewStep(e.target.value)}
                        className="resize-none"
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label htmlFor="stepDuration">Duration (minutes) - Optional</Label>
                        <Input
                          id="stepDuration"
                          type="number"
                          placeholder="10"
                          value={stepDuration || ""}
                          onChange={(e) => setStepDuration(parseInt(e.target.value) || undefined)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          onClick={addStep}
                          className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Step
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Steps List */}
                {recipeData.steps.length > 0 ? (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      Recipe Steps ({recipeData.steps.length})
                    </Label>
                    {recipeData.steps.map((step, index) => (
                      <div
                        key={step.id}
                        className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-orange-100 dark:border-orange-900 hover:border-orange-300 dark:hover:border-orange-700 transition-all group"
                      >
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center text-white font-bold text-lg">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-base leading-relaxed">{step.instruction}</p>
                          {step.duration && (
                            <div className="flex items-center gap-1 mt-2 text-sm text-orange-600 font-medium">
                              <Clock className="h-3 w-3" />
                              {step.duration} minutes
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950 flex-shrink-0"
                          onClick={() => removeStep(step.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-lg">No steps added yet</p>
                    <p className="text-sm">Add your first cooking step above</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                onClick={() => setActiveTab("ingredients")}
                variant="outline"
                size="lg"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit || isPending}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8"
              >
                {isPending ? "Creating Recipe..." : "Create Recipe"}
                <Check className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
