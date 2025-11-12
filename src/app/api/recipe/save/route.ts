import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Calculate total cost from ingredients
    const totalCost = data.ingredients.reduce(
      (sum: number, ing: { calculatedPrice?: number }) => sum + (ing.calculatedPrice || 0),
      0
    )

    const recipe = await db.recipe.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        servings: data.servings,
        difficulty: data.difficulty,
        image: data.image,
        totalCost: totalCost,
        authorId: session.user.id,
        ingredients: {
          create: data.ingredients.map((ing: { name: string; quantity: number; unit: string; notes?: string; calculatedPrice?: number; masterId?: string }) => ({
            ingredientName: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
            notes: ing.notes,
            calculatedPrice: ing.calculatedPrice,
            masterIngredientId: ing.masterId,
          })),
        },
        steps: {
          create: data.steps.map((step: { instruction: string; duration?: number }, index: number) => ({
            stepNumber: index + 1,
            instruction: step.instruction,
            duration: step.duration,
          })),
        },
        tags: {
          create: data.tags?.map((tag: string) => ({ tag })) || [],
        },
      },
    })

    return NextResponse.json(recipe)
  } catch (error) {
    console.error("Error creating recipe:", error)
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    )
  }
}