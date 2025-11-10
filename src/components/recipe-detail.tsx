"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteRecipeDialog } from "@/components/delete-recipe-dialog"
import { ArrowLeft, Edit, Printer, ChefHat, Clock, Users, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface RecipeDetailProps {
    recipe: {
        id: string
        title: string
        description: string | null
        category: string | null
        createdAt: Date
        ingredients: Array<{
            id: string
            name: string
            quantity: string
            measureType: string
        }>
        steps: Array<{
            id: string
            content: string
        }>
    }
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
    const [cookingMode, setCookingMode] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const handlePrint = () => {
        window.print()
    }

    const getCategoryColor = (category: string | null) => {
        const colors: Record<string, string> = {
            cake: "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300",
            cookie: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
            pastry: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
            bread: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
            pie: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
            candy: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
            other: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        }
        return colors[category || "other"] || colors.other
    }

    if (cookingMode) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 p-4 print:hidden">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <Button
                            variant="outline"
                            onClick={() => setCookingMode(false)}
                            className="bg-white dark:bg-gray-800"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Exit Cooking Mode
                        </Button>
                        <div className="text-sm text-muted-foreground bg-white dark:bg-gray-800 px-4 py-2 rounded-lg">
                            Step {currentStep + 1} of {recipe.steps.length}
                        </div>
                    </div>

                    <Card className="border-2">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-2xl">{recipe.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {/* Current Step */}
                            <div className="bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-950 dark:to-amber-950 rounded-lg p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-600 to-amber-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                        {currentStep + 1}
                                    </div>
                                    <p className="text-lg leading-relaxed flex-1">
                                        {recipe.steps[currentStep]?.content}
                                    </p>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                    disabled={currentStep === 0}
                                    className="flex-1"
                                >
                                    Previous
                                </Button>
                                <Button
                                    size="lg"
                                    onClick={() =>
                                        setCurrentStep(Math.min(recipe.steps.length - 1, currentStep + 1))
                                    }
                                    disabled={currentStep === recipe.steps.length - 1}
                                    className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                                >
                                    Next Step
                                </Button>
                            </div>

                            {/* Quick Reference */}
                            <Card className="bg-muted/50">
                                <CardHeader>
                                    <CardTitle className="text-base">Ingredients Quick Reference</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                        {recipe.ingredients.map((ingredient, index) => (
                                            <div key={index} className="flex justify-between">
                                                <span>{ingredient.name}</span>
                                                <span className="text-muted-foreground">
                                                    {ingredient.quantity} {ingredient.measureType}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <>
            <style jsx global>{`
                @media print {
                    header,
                    nav,
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>

            <div className="container py-8 max-w-5xl mx-auto">
                {/* Back Button and Actions */}
                <div className="flex items-center justify-between mb-6 no-print">
                    <Button variant="ghost" asChild>
                        <Link href="/recipes" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Recipes
                        </Link>
                    </Button>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handlePrint}>
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 border-orange-200 dark:border-orange-900"
                            onClick={() => setCookingMode(true)}
                        >
                            <ChefHat className="h-4 w-4 mr-2" />
                            Cooking Mode
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/recipes/${recipe.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:bg-red-50 dark:hover:bg-red-950"
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Recipe Header */}
                <div className="space-y-4 mb-8">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                                {recipe.title}
                            </h1>
                            {recipe.description && (
                                <p className="text-lg text-muted-foreground">{recipe.description}</p>
                            )}
                        </div>
                        {recipe.category && (
                            <Badge variant="secondary" className={`${getCategoryColor(recipe.category)} text-base px-4 py-1`}>
                                {recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)}
                            </Badge>
                        )}
                    </div>

                    {/* Recipe Stats */}
                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{recipe.ingredients.length} ingredients</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{recipe.steps.length} steps</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs">
                                Added {new Date(recipe.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Recipe Content */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Ingredients */}
                    <div className="lg:col-span-2">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="h-8 w-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                                        <Users className="h-4 w-4 text-white" />
                                    </div>
                                    Ingredients
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {recipe.ingredients.map((ingredient, index) => (
                                        <li
                                            key={index}
                                            className="flex justify-between items-start gap-3 pb-3 border-b last:border-0 last:pb-0"
                                        >
                                            <span className="font-medium">{ingredient.name}</span>
                                            <span className="text-muted-foreground whitespace-nowrap">
                                                {ingredient.quantity} {ingredient.measureType}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Directions */}
                    <div className="lg:col-span-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                        <ChefHat className="h-4 w-4 text-white" />
                                    </div>
                                    Directions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ol className="space-y-6">
                                    {recipe.steps.map((step, index) => (
                                        <li key={index} className="flex gap-4 group">
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-amber-600 rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                                                    {index + 1}
                                                </div>
                                            </div>
                                            <div className="flex-1 pt-1">
                                                <p className="text-base leading-relaxed">{step.content}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <DeleteRecipeDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                recipeId={recipe.id}
                recipeTitle={recipe.title}
            />
        </>
    )
}
