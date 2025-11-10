import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import EnhancedRecipeCreation from './_new-recipe'

export default async function page() {
        const session = await auth()
    
        if (!session?.user) {
            redirect("/login")
        }
  return (
    <EnhancedRecipeCreation />
  )
}
