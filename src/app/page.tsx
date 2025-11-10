import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChefHat, Clock, Heart, Search, Sparkles, Users } from "lucide-react"
import Link from "next/link"

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />
        <div className="container relative mx-auto px-4 py-24 sm:py-32 lg:py-40">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full border border-orange-200 dark:border-orange-900">
              <Sparkles className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Your Personal Recipe Collection
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white max-w-4xl">
              Cook Better With{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                RecipeChef
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
              Organize your favorite recipes, discover new dishes, and become the chef you've always wanted to be.
              All your culinary inspiration in one beautiful place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="text-base px-8 h-12 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700" asChild>
                <Link href="/recipes/new">
                  <ChefHat className="mr-2 h-5 w-5" />
                  Start Cooking
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 h-12 border-2" asChild>
                <Link href="/recipes">
                  View Recipes
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>10k+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <span>50k+ Recipes</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <span>Free Forever</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Master Your Kitchen
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Powerful features designed to make recipe management effortless and enjoyable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Card className="border-2 hover:border-orange-200 dark:hover:border-orange-900 transition-all hover:shadow-lg group">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Smart Search</CardTitle>
                <CardDescription className="text-base">
                  Find any recipe instantly with our powerful search. Filter by ingredients, category, or cooking time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-orange-200 dark:hover:border-orange-900 transition-all hover:shadow-lg group">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Quick & Easy</CardTitle>
                <CardDescription className="text-base">
                  Add recipes in seconds with our intuitive interface. Step-by-step guidance makes it effortless.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-orange-200 dark:hover:border-orange-900 transition-all hover:shadow-lg group">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Personal Collection</CardTitle>
                <CardDescription className="text-base">
                  Build your own digital cookbook. Organize, categorize, and access your recipes from anywhere.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-orange-200 dark:hover:border-orange-900 transition-all hover:shadow-lg group">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ChefHat className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Cooking Mode</CardTitle>
                <CardDescription className="text-base">
                  Follow along with our distraction-free cooking mode. Large text and voice commands keep you focused.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-orange-200 dark:hover:border-orange-900 transition-all hover:shadow-lg group">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Beautiful Design</CardTitle>
                <CardDescription className="text-base">
                  Enjoy a modern, clean interface that makes recipe management a pleasure. Dark mode included.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-orange-200 dark:hover:border-orange-900 transition-all hover:shadow-lg group">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Share & Discover</CardTitle>
                <CardDescription className="text-base">
                  Share your favorite recipes with friends and family. Discover new dishes from the community.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-orange-600 to-amber-600 dark:from-orange-900 dark:to-amber-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Ready to Transform Your Cooking?
            </h2>
            <p className="text-lg sm:text-xl text-orange-50">
              Join thousands of home chefs who have organized their recipes and elevated their cooking game.
              Start your culinary journey today - completely free!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="text-base px-8 h-12 bg-white text-orange-600 hover:bg-orange-50"
                asChild
              >
                <Link href="/recipes/new">
                  <ChefHat className="mr-2 h-5 w-5" />
                  Create Your First Recipe
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-12 border-2 border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/recipes">
                  Browse Recipes
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 dark:bg-gray-900 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-orange-600" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">RecipeChef</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your personal recipe companion. Made with love for home chefs everywhere.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              © 2024 RecipeChef. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
