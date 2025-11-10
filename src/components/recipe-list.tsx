"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Clock, Users, Eye, Trash2, TrendingUp, Filter } from "lucide-react"
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

  return (
    <div className="container py-8 mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Recipes</h1>
          <p className="text-muted-foreground mt-1">
            {filteredRecipes?.length || 0} recipe{filteredRecipes?.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Link href="/recipes/new">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Add New Recipe
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recipes by title or description..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full justify-start overflow-x-auto">
            {CATEGORIES.map((category) => (
              <TabsTrigger key={category} value={category} className="whitespace-nowrap">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Recipe Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-muted animate-pulse" />
              <CardHeader>
                <div className="h-6 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-3/4 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : sortedRecipes && sortedRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRecipes.map((recipe) => (
            <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              {/* Recipe Image */}
              <div className="relative h-48 bg-gradient-to-br from-orange-100 to-pink-100 overflow-hidden">
                {recipe.image ? (
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-50">
                    🧁
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-white/90 backdrop-blur">
                    {recipe.category}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="line-clamp-2">{recipe.title}</CardTitle>
                {recipe.description && (
                  <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Recipe Stats */}
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {recipe.prepTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{recipe.prepTime + (recipe.cookTime || 0)} min</span>
                    </div>
                  )}
                  {recipe.servings && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{recipe.servings} servings</span>
                    </div>
                  )}
                  {recipe.totalCost && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>₦{recipe.totalCost.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Difficulty Badge */}
                {recipe.difficulty && (
                  <div>
                    <Badge
                      variant={
                        recipe.difficulty === "Easy"
                          ? "default"
                          : recipe.difficulty === "Medium"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {recipe.difficulty}
                    </Badge>
                  </div>
                )}

                {/* Tags */}
                {recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag.tag} variant="outline" className="text-xs">
                        {tag.tag}
                      </Badge>
                    ))}
                    {recipe.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{recipe.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Ingredient & Step Count */}
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  {recipe._count.ingredients} ingredients • {recipe._count.steps} steps
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Link href={`/recipes/${recipe.id}`} className="flex-1">
                  <Button variant="default" className="w-full gap-2">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </Link>
                <Button variant="outline" size="icon">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <div className="text-6xl">📝</div>
            <h3 className="text-xl font-semibold">No recipes found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedCategory !== "All"
                ? "Try adjusting your filters"
                : "Start by creating your first recipe"}
            </p>
            <Link href="/recipes/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Recipe
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}