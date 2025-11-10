"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DeleteRecipeDialog } from "@/components/delete-recipe-dialog"
import { Recipe } from "@prisma/client"
import { Calendar, Eye, Plus, Search, Trash2, Filter, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"

type RecipeFuse<T extends { ingredients: unknown[]; steps: unknown[] }> = T & Recipe

type SortOption = "newest" | "oldest" | "title-asc" | "title-desc"

export function RecipeList({ recipes: recipesList }: { recipes: RecipeFuse<{ ingredients: unknown[]; steps: unknown[] }>[] }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState<string>("all")
    const [sortBy, setSortBy] = useState<SortOption>("newest")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [recipeToDelete, setRecipeToDelete] = useState<{ id: string; title: string } | null>(null)

    const filteredAndSortedRecipes = useMemo(() => {
        let filtered = recipesList.filter((recipe) => {
            const matchesSearch =
                recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.description?.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesCategory = categoryFilter === "all" || recipe.category === categoryFilter

            return matchesSearch && matchesCategory
        })

        // Sort recipes
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                case "oldest":
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                case "title-asc":
                    return a.title.localeCompare(b.title)
                case "title-desc":
                    return b.title.localeCompare(a.title)
                default:
                    return 0
            }
        })

        return filtered
    }, [recipesList, searchTerm, categoryFilter, sortBy])

    const handleDeleteRecipe = (id: string, title: string) => {
        setRecipeToDelete({ id, title })
        setDeleteDialogOpen(true)
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

    const categories = useMemo(() => {
        const cats = new Set(recipesList.map((r) => r.category))
        return Array.from(cats).filter(Boolean)
    }, [recipesList])

    return (
        <div className="container py-8 space-y-6 mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                        My Recipes
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {filteredAndSortedRecipes.length} {filteredAndSortedRecipes.length === 1 ? "recipe" : "recipes"} found
                    </p>
                </div>
                <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
                    <Link href="/recipes/new" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Recipe
                    </Link>
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search recipes by title or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat} value={cat || ""}>
                                {cat?.charAt(0).toUpperCase() + cat?.slice(1)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                        <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Recipes Grid */}
            {filteredAndSortedRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedRecipes.map((recipe, index) => (
                        <Card
                            key={recipe.id}
                            className="flex flex-col hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 hover:border-orange-200 dark:hover:border-orange-900 group"
                            style={{
                                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                            }}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-2">
                                    <CardTitle className="text-lg line-clamp-2 group-hover:text-orange-600 transition-colors">
                                        {recipe.title}
                                    </CardTitle>
                                    <Badge variant="secondary" className={getCategoryColor(recipe?.category || "")}>
                                        {recipe.category}
                                    </Badge>
                                </div>
                                {recipe.description && (
                                    <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
                                )}
                            </CardHeader>

                            <CardContent className="flex-1 pb-3">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <span className="font-medium text-orange-600">
                                            {recipe?.ingredients?.length}
                                        </span>{" "}
                                        ingredients
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <span className="font-medium text-orange-600">{recipe.steps.length}</span> steps
                                    </span>
                                </div>
                            </CardContent>

                            <CardFooter className="flex items-center justify-between pt-3 border-t">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(recipe.createdAt)}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="hover:bg-orange-50 dark:hover:bg-orange-950"
                                        asChild
                                    >
                                        <Link href={`/recipes/${recipe.id}`} className="flex items-center gap-1">
                                            <Eye className="h-3 w-3" />
                                            View
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-destructive hover:bg-red-50 dark:hover:bg-red-950 hover:text-destructive"
                                        onClick={() => handleDeleteRecipe(recipe.id, recipe.title)}
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
                <div className="text-center py-16 px-4">
                    {searchTerm || categoryFilter !== "all" ? (
                        <div className="space-y-4 max-w-md mx-auto">
                            <div className="h-20 w-20 mx-auto bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-950 dark:to-amber-950 rounded-full flex items-center justify-center">
                                <Search className="h-10 w-10 text-orange-600" />
                            </div>
                            <p className="text-xl font-semibold text-gray-900 dark:text-white">No recipes found</p>
                            <p className="text-muted-foreground">
                                Try adjusting your search or filter to find what you're looking for
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm("")
                                    setCategoryFilter("all")
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6 max-w-md mx-auto">
                            <div className="h-24 w-24 mx-auto bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                                <Plus className="h-12 w-12 text-white" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">No recipes yet</p>
                                <p className="text-muted-foreground">
                                    Start building your personal cookbook by creating your first recipe
                                </p>
                            </div>
                            <Button
                                asChild
                                size="lg"
                                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                            >
                                <Link href="/recipes/new" className="flex items-center gap-2">
                                    <Plus className="h-5 w-5" />
                                    Create Your First Recipe
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            )}

            <style jsx global>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>

            {recipeToDelete && (
                <DeleteRecipeDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    recipeId={recipeToDelete.id}
                    recipeTitle={recipeToDelete.title}
                />
            )}
        </div>
    )
}
