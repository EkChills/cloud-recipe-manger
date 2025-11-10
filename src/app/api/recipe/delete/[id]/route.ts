import { auth } from "@/auth"
import { db } from "@/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params

        // Check if recipe exists and belongs to user
        const recipe = await db.recipe.findFirst({
            where: {
                id,
                authorId: session.user.id,
            },
        })

        if (!recipe) {
            return NextResponse.json(
                { error: "Recipe not found or unauthorized" },
                { status: 404 }
            )
        }

        // Delete recipe (cascade will delete ingredients and steps)
        await db.recipe.delete({
            where: { id },
        })

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error("Error deleting recipe:", error)
        return NextResponse.json(
            { error: "Failed to delete recipe" },
            { status: 500 }
        )
    }
}
