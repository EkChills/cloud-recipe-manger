"use client"

import { useState } from "react"
import { RecipeForm } from "@/components/recipe-form"
import { IngredientsTab } from "@/components/ingredients-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Details, Ingredient, RecipeData, Step } from "@/lib/models"
import { DirectionsTab } from "@/components/directions-tab"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function NewRecipePage() {
  const [activeTab, setActiveTab] = useState("details")
  const [recipeData, setRecipeData] = useState<RecipeData>({details: null, ingredients: [], directions: [] })
  const router = useRouter()

  const {mutate, isPending} = useMutation({
    mutationKey: ["createRecipe"],
    mutationFn: async (data: RecipeData) => {
      await axios.post("/api/recipe/save", data)
      // Here you would typically send a POST request to your API to save the recipe
      console.log("Saving recipe data:", data)
      return data
    },
    onSuccess: () => {
      toast.success("Recipe created successfully!")
      router.push("/recipes") // Redirect to the recipe list page
    },
    onError: () => {
      toast.error("Failed to create recipe. Please try again.")
    }
  })

  const handleDetailsNext = (data: Details) => {
    setRecipeData((prev) => ({ ...prev, details: data }))
    console.log(data, "details data");
    
    setActiveTab("ingredients")
  }

  const handleIngredientsNext = (ingredients: Ingredient[]) => {
    setActiveTab("directions")
    // This would navigate to the directions tab in a full implementation
    setRecipeData((prev) => ({ ...prev, ingredients: ingredients }))
    console.log("Moving to directions tab")
  }

const handleDirectionsFinish = (steps: Step[]) => {
  const updatedRecipe = { ...recipeData, directions: [...steps] }

  setRecipeData(updatedRecipe)
  mutate(updatedRecipe)

  console.log("Recipe data ready:", updatedRecipe)
  console.log("Recipe creation completed!")
}

  return (
    <div className="container py-10 mx-auto">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create New Recipe</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger
                value="details"
                disabled={recipeData.details !== null}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Recipe Details
              </TabsTrigger>
              <TabsTrigger
                value="ingredients"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                disabled={recipeData.ingredients.length > 0 || !recipeData.details}
              >
                Ingredients
              </TabsTrigger>
              <TabsTrigger
                value="directions"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                disabled={!recipeData.ingredients.length || !recipeData.details}>
                Directions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <RecipeForm onNext={handleDetailsNext} />
            </TabsContent>

            <TabsContent value="ingredients">
              <IngredientsTab onNext={handleIngredientsNext} />
            </TabsContent>

            <TabsContent value="directions">
              <DirectionsTab isPending={isPending} recipeData={recipeData} onFinish={handleDirectionsFinish} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
