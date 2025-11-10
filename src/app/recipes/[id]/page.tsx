import { auth } from "@/auth"
import { RecipeDetail } from "@/components/recipe-detail"
import { db } from "@/prisma"
import { notFound, redirect } from "next/navigation"

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const recipe = await db.recipe.findFirst({
    where: { id: (await params).id },
    include: {
      ingredients: true,
      steps: true,
    },
  })

  if (!recipe) {
    notFound()
  }

  return <RecipeDetail recipe={recipe} />
}
