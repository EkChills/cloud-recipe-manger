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
import { Check, ChefHat, ListChecks, FileText } from "lucide-react"

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

const STEPS_CONFIG = [
  { id: 1, title: "Basic details", icon: FileText, description: "Recipe information" },
  { id: 2, title: "Ingredients", icon: ChefHat, description: "What you need" },
  { id: 3, title: "Directions", icon: ListChecks, description: "Step by step" },
]

export default function EnhancedRecipeCreation() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
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

  useQuery({
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

  const canProceedToStep2 = recipeData.title && recipeData.category
  const canProceedToStep3 = recipeData.ingredients.length > 0
  const canSubmit = recipeData.title && recipeData.category && recipeData.ingredients.length > 0 && recipeData.steps.length > 0

  const handleNext = () => {
    if (currentStep === 1 && !canProceedToStep2) {
      toast.error("Please complete title and category")
      return
    }
    if (currentStep === 2 && !canProceedToStep3) {
      toast.error("Please add at least one ingredient")
      return
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = () => {
    if (!canSubmit) {
      toast.error("Please complete all required fields")
      return
    }
    saveRecipe(recipeData)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl py-12 mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <Link href="/recipes" className="text-sm font-medium text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2">
            ← Back to recipes
          </Link>
          <h1 className="text-4xl font-bold mt-4">
            Create new recipe
          </h1>
          <p className="text-muted-foreground mt-2">Follow the steps to create your perfect recipe</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {/* Progress Bar Background */}
            <div className="absolute top-[22px] left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800" />
            <div
              className="absolute top-[22px] left-0 h-1 bg-gradient-to-r from-orange-600 to-amber-600 transition-all duration-500 ease-out"
              style={{ width: `${((currentStep - 1) / (STEPS_CONFIG.length - 1)) * 100}%` }}
            />

            {STEPS_CONFIG.map((step) => {
              const isCompleted = currentStep > step.id
              const isCurrent = currentStep === step.id
              const StepIcon = step.icon

              return (
                <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
                  <button
                    onClick={() => {
                      if (step.id < currentStep || (step.id === 2 && canProceedToStep2) || (step.id === 3 && canProceedToStep3)) {
                        setCurrentStep(step.id)
                      }
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? "bg-gradient-to-br from-orange-600 to-amber-600 shadow-lg scale-100"
                        : isCurrent
                        ? "bg-gradient-to-br from-orange-600 to-amber-600 shadow-xl scale-110 ring-4 ring-orange-200 dark:ring-orange-900"
                        : "bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <StepIcon className={`w-5 h-5 ${isCurrent ? "text-white" : "text-gray-400"}`} />
                    )}
                  </button>
                  <div className="text-center mt-3">
                    <p className={`text-sm font-semibold ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Step 1: Basic Details */}
          {currentStep === 1 && (
            <Card className="border shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Basic details</CardTitle>
                <CardDescription>Tell us about your recipe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Classic Chocolate Cake"
                    value={recipeData.title}
                    onChange={(e) => setRecipeData({ ...recipeData, title: e.target.value })}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="What makes this recipe special?"
                    rows={4}
                    value={recipeData.description}
                    onChange={(e) => setRecipeData({ ...recipeData, description: e.target.value })}
                    className="resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
                    <Select
                      value={recipeData.category}
                      onValueChange={(value) => setRecipeData({ ...recipeData, category: value })}
                    >
                      <SelectTrigger className="h-11">
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
                    <Label htmlFor="difficulty" className="text-sm font-medium">Difficulty</Label>
                    <Select
                      value={recipeData.difficulty}
                      onValueChange={(value) => setRecipeData({ ...recipeData, difficulty: value })}
                    >
                      <SelectTrigger className="h-11">
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="prepTime" className="text-sm font-medium">Prep time (min)</Label>
                    <Input
                      id="prepTime"
                      type="number"
                      placeholder="30"
                      value={recipeData.prepTime || ""}
                      onChange={(e) => setRecipeData({ ...recipeData, prepTime: parseInt(e.target.value) || undefined })}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cookTime" className="text-sm font-medium">Cook time (min)</Label>
                    <Input
                      id="cookTime"
                      type="number"
                      placeholder="45"
                      value={recipeData.cookTime || ""}
                      onChange={(e) => setRecipeData({ ...recipeData, cookTime: parseInt(e.target.value) || undefined })}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="servings" className="text-sm font-medium">Servings</Label>
                    <Input
                      id="servings"
                      type="number"
                      placeholder="4"
                      value={recipeData.servings || ""}
                      onChange={(e) => setRecipeData({ ...recipeData, servings: parseInt(e.target.value) || undefined })}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      className="h-11"
                    />
                    <Button onClick={addTag} variant="outline" className="h-11 px-6">
                      Add
                    </Button>
                  </div>
                  {recipeData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {recipeData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:text-destructive"
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
          )}

          {/* Step 2: Ingredients */}
          {currentStep === 2 && (
            <Card className="border shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Ingredients ({recipeData.ingredients.length})</CardTitle>
                <CardDescription>What do you need to make this recipe?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-12 sm:col-span-5">
                    <Input
                      placeholder="Ingredient name"
                      value={newIngredient.name}
                      onChange={(e) => {
                        setNewIngredient({ ...newIngredient, name: e.target.value })
                        setIngredientSearch(e.target.value)
                      }}
                      className="h-11"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Quantity"
                      value={newIngredient.quantity || ""}
                      onChange={(e) => setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) })}
                      className="h-11"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <Select
                      value={newIngredient.unit}
                      onValueChange={(value) => setNewIngredient({ ...newIngredient, unit: value })}
                    >
                      <SelectTrigger className="h-11">
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
                  <div className="col-span-2 sm:col-span-2">
                    <Button onClick={addIngredient} variant="outline" className="w-full h-11">
                      Add
                    </Button>
                  </div>
                </div>

                {recipeData.ingredients.length > 0 && (
                  <div className="space-y-3">
                    {recipeData.ingredients.map((ingredient) => (
                      <div
                        key={ingredient.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-xs text-muted-foreground w-6">
                            {recipeData.ingredients.indexOf(ingredient) + 1}.
                          </div>
                          <span className="font-semibold">{ingredient.name}</span>
                          <span className="text-muted-foreground">
                            {ingredient.quantity} {ingredient.unit}
                          </span>
                        </div>
                        <button
                          onClick={() => removeIngredient(ingredient.id)}
                          className="text-muted-foreground hover:text-destructive font-bold text-xl"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Directions */}
          {currentStep === 3 && (
            <Card className="border shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Directions ({recipeData.steps.length})</CardTitle>
                <CardDescription>Step-by-step cooking instructions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Textarea
                    placeholder="e.g., Preheat the oven to 350°F..."
                    rows={4}
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    className="resize-none"
                  />
                  <div className="flex gap-3">
                    <Input
                      type="number"
                      placeholder="Duration (min)"
                      value={stepDuration || ""}
                      onChange={(e) => setStepDuration(parseInt(e.target.value) || undefined)}
                      className="h-11"
                    />
                    <Button onClick={addStep} variant="outline" className="h-11 px-6">
                      Add step
                    </Button>
                  </div>
                </div>

                {recipeData.steps.length > 0 && (
                  <div className="space-y-3">
                    {recipeData.steps.map((step) => (
                      <div
                        key={step.id}
                        className="flex gap-4 p-5 rounded-lg border hover:bg-accent/50 transition-all"
                      >
                        <div className="h-10 w-10 rounded-lg border-2 flex items-center justify-center text-lg font-bold flex-shrink-0">
                          {recipeData.steps.indexOf(step) + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium leading-relaxed">{step.instruction}</p>
                          {step.duration && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {step.duration} minutes
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeStep(step.id)}
                          className="text-muted-foreground hover:text-destructive font-bold text-xl flex-shrink-0"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="h-12 px-8"
            >
              ← Back
            </Button>

            <div className="flex gap-3">
              <Link href="/recipes">
                <Button variant="outline" className="h-12 px-8">
                  Cancel
                </Button>
              </Link>
              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  className="h-12 px-8 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                >
                  Continue →
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isPending}
                  className="h-12 px-8 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                >
                  {isPending ? "Creating..." : "Create recipe"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
