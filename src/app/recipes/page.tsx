import { auth } from "@/auth"
import RecipeListPage from "@/components/recipe-list"
import { db } from "@/prisma"
import { redirect } from "next/navigation"

export default async function RecipesPage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }
    const recipes = await db.recipe.findMany({
        where: {
            authorId: session.user.id
        },
        include: {
            steps: true,
            ingredients: true
        }
    })
  return <RecipeListPage />
}
