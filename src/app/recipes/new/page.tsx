import React from 'react'
import NewRecipePage from './_new-recipe'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function page() {
        const session = await auth()
    
        if (!session?.user) {
            redirect("/login")
        }
  return (
    <NewRecipePage />
  )
}
