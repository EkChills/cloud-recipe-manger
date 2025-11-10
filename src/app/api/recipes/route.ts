import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/prisma"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const recipes = await db.recipe.findMany({
      where: {
        authorId: session.user.id,
      },
      include: {
        tags: {
          select: {
            tag: true,
          },
        },
        _count: {
          select: {
            ingredients: true,
            steps: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(recipes)
  } catch (error) {
    console.error("Error fetching recipes:", error)
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    )
  }
}