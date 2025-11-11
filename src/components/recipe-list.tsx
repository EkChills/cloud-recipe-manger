"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DeleteRecipeDialog } from "@/components/delete-recipe-dialog"
import { Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

interface Recipe {
  id: string
  title: string
  description?: string
  image?: string
  category: string
  prepTime?: number
  cookTime?: number
  servings?: number
  difficulty?: string
  totalCost?: number
  tags: { tag: string }[]
  createdAt: string
  _count: {
    ingredients: number
    steps: number
  }
}

const CATEGORIES = ["All", "Cake", "Bread", "Pastry", "Candy", "Cookies", "Other"]

export default function RecipeListPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [recipeToDelete, setRecipeToDelete] = useState<{ id: string; title: string } | null>(null)

  const { data: recipes, isLoading } = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const { data } = await axios.get("/api/recipes")
      return data as Recipe[]
    },
  })

  const filteredRecipes = recipes?.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedRecipes = filteredRecipes?.sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    if (sortBy === "name") return a.title.localeCompare(b.title)
    return 0
  })

  const handleDeleteClick = (id: string, title: string) => {
    setRecipeToDelete({ id, title })
    setDeleteDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl py-8 mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight mb-2">Recipes</h1>
              <p className="text-sm text-muted-foreground">
                {sortedRecipes?.length || 0} recipes
              </p>
            </div>
            <Link href="/recipes/new">
              <Button className="h-9 px-4 text-sm">
                New recipe
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recipes..."
                className="pl-9 h-9 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[160px] h-9 text-sm">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category} className="text-sm">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[160px] h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest" className="text-sm">Newest first</SelectItem>
                <SelectItem value="oldest" className="text-sm">Oldest first</SelectItem>
                <SelectItem value="name" className="text-sm">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Recipe Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-5">
                <div className="space-y-3">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-muted animate-pulse rounded w-full" />
                  <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                </div>
              </Card>
            ))}
          </div>
        ) : sortedRecipes && sortedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedRecipes.map((recipe) => (
              <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                <Card className="p-5 hover:bg-accent/50 transition-colors cursor-pointer group h-full">
                  <div className="flex flex-col gap-3 h-full">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                          {recipe.title}
                        </h3>
                        {recipe.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {recipe.description}
                          </p>
                        )}
                      </div>
                      {recipe.category && (
                        <Badge variant="secondary" className="text-xs flex-shrink-0">
                          {recipe.category}
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {recipe.prepTime && (
                        <span>{recipe.prepTime + (recipe.cookTime || 0)} min</span>
                      )}
                      {recipe.servings && (
                        <>
                          <span>•</span>
                          <span>{recipe.servings} servings</span>
                        </>
                      )}
                      {recipe._count && (
                        <>
                          <span>•</span>
                          <span>{recipe._count.ingredients} ingredients</span>
                        </>
                      )}
                    </div>

                    {recipe.difficulty && (
                      <div className="pt-2 border-t">
                        <Badge
                          variant={
                            recipe.difficulty === "Easy"
                              ? "default"
                              : recipe.difficulty === "Medium"
                              ? "secondary"
                              : "destructive"
                          }
                          className="text-xs"
                        >
                          {recipe.difficulty}
                        </Badge>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-12">
            <div className="text-center space-y-3">
              <h3 className="text-lg font-semibold">No recipes found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery || selectedCategory !== "All"
                  ? "Try adjusting your filters"
                  : "Get started by creating your first recipe"}
              </p>
              {!searchQuery && selectedCategory === "All" && (
                <Link href="/recipes/new">
                  <Button className="mt-4 h-9 px-4 text-sm">
                    Create recipe
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Delete Dialog */}
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
