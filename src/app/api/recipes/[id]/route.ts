import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const recipe = await db.recipe.findUnique({
      where: {
        id,
        authorId: session.user.id,
      },
      include: {
        ingredients: {
          orderBy: {
            id: "asc",
          },
        },
        steps: {
          orderBy: {
            stepNumber: "asc",
          },
        },
        tags: {
          select: {
            tag: true,
          },
        },
        author: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    return NextResponse.json(recipe)
  } catch (error) {
    console.error("Error fetching recipe:", error)
    return NextResponse.json(
      { error: "Failed to fetch recipe" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await db.recipe.delete({
      where: {
        id,
        authorId: session.user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting recipe:", error)
    return NextResponse.json(
      { error: "Failed to delete recipe" },
      { status: 500 }
    )
  }
}