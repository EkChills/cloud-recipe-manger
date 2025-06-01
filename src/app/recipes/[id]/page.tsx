import { auth } from "@/auth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/prisma"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

// This would typically fetch the recipe from your database


export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
        const session = await auth()
    
        if (!session?.user) {
            redirect("/login")
        }
  const recipe = await db.recipe.findFirst({
    where: {id: ((await (params)).id)},
    include: {
      ingredients: true,
      steps: true,
    },
  })

  if (!recipe) {
    notFound()
  }

  console.log(recipe, "recipe details");
  
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/recipes" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Recipes
          </Link>
        </Button>

        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{recipe.title}</h1>
              {recipe.description && <p className="text-muted-foreground mt-2">{recipe.description}</p>}
            </div>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              {recipe.category}
            </Badge>
          </div>

          
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex justify-between">
                  <span>{ingredient.name}</span>
                  <span className="text-muted-foreground">
                    {ingredient.quantity} {ingredient.measureType}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Directions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {recipe.steps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-relaxed">{step.content}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
