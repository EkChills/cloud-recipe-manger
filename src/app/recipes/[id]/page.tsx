import { auth } from "@/auth"
import { redirect } from "next/navigation"
import RecipeDetail from "./_recipe_detail_enhanced"

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    const { id } = await params

    return <RecipeDetail recipeId={id} />
}
