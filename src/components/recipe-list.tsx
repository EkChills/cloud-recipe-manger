"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Recipe } from "@prisma/client"
import { Calendar, Eye, Plus, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

type RecipeFuse<T extends { ingredients: unknown[]; steps: unknown[] }> = T & Recipe


export function RecipeList({ recipes: recipesList }: { recipes: RecipeFuse<{ ingredients: unknown[]; steps: unknown[] }>[] }) {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredRecipes = recipesList.filter(
        (recipe) =>
            recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleDeleteRecipe = (id: string) => {
        // This would handle recipe deletion in a real app
        console.log("Deleting recipe:", id)
    }

    const formatDate = (dateString: Date) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            cake: "bg-pink-100 text-pink-800",
            cookie: "bg-amber-100 text-amber-800",
            pastry: "bg-purple-100 text-purple-800",
            bread: "bg-orange-100 text-orange-800",
            pie: "bg-green-100 text-green-800",
            candy: "bg-red-100 text-red-800",
            other: "bg-gray-100 text-gray-800",
        }
        return colors[category] || colors.other
    }

    return (
        <div className="container py-8 space-y-6 mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">My Recipes</h1>
                    <p className="text-muted-foreground">
                        {filteredRecipes.length} {filteredRecipes.length === 1 ? "recipe" : "recipes"} found
                    </p>
                </div>
                <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href="/recipes/new" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Recipe
                    </Link>
                </Button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Search recipes by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Recipes Grid */}
            {filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecipes.map((recipe) => (
                        <Card key={recipe.id} className="flex flex-col hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-2">
                                    <CardTitle className="text-lg line-clamp-2">{recipe.title}</CardTitle>
                                    <Badge variant="secondary" className={getCategoryColor(recipe?.category || "")}>
                                        {recipe.category}
                                    </Badge>
                                </div>
                                {recipe.description && <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>}
                            </CardHeader>

                            <CardContent className="flex-1 pb-3">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>{recipe?.ingredients?.length} ingredients</span>
                                    <span>•</span>
                                    <span>{recipe.steps.length} steps</span>
                                </div>
                            </CardContent>

                            <CardFooter className="flex items-center justify-between pt-3 border-t">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(recipe.createdAt)}
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/recipes/${recipe.id}`} className="flex items-center gap-1">
                                            <Eye className="h-3 w-3" />
                                            View
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => handleDeleteRecipe(recipe.id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    {searchTerm ? (
                        <div className="space-y-2">
                            <p className="text-lg text-muted-foreground">No recipes found matching {searchTerm}</p>
                            <p className="text-sm text-muted-foreground">Try adjusting your search terms</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-lg text-muted-foreground">No recipes yet</p>
                            <p className="text-sm text-muted-foreground">Create your first recipe to get started</p>
                            <Button asChild>
                                <Link href="/recipes/new" className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Your First Recipe
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
