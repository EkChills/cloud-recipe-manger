import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BookOpen, ChefHat, LogOut, Settings, User, Plus, Compass } from "lucide-react"
import Link from "next/link"
import MobileNav from "./mobile-nav-menu"
import { auth, signIn, signOut } from "@/auth"

export async function Navbar() {
  const session = await auth()

  const handleLogout = async () => {
    "use server"
    await signOut({ redirectTo: "/" })
  }

  const handleLogin = async () => {
    "use server"
    await signIn("google", { redirectTo: "/recipes/new" })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <ChefHat className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold hidden sm:inline">RecipeChef</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/recipes">
            <Button variant="ghost" className="gap-2">
              <BookOpen className="h-4 w-4" />
              My Recipes
            </Button>
          </Link>
          <Link href="/recipes/new">
            <Button variant="ghost" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Recipe
            </Button>
          </Link>
          <Link href="/discover">
            <Button variant="ghost" className="gap-2">
              <Compass className="h-4 w-4" />
              Discover
            </Button>
          </Link>
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-2">
          {!session?.user ? (
            <form action={handleLogin}>
              <Button type="submit" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            </form>
          ) : (
            <>
              {/* Desktop User Menu */}
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {session.user.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/recipes" className="cursor-pointer">
                        <BookOpen className="mr-2 h-4 w-4" />
                        My Recipes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <form action={handleLogout} className="w-full">
                        <button
                          type="submit"
                          className="w-full flex items-center text-destructive focus:text-destructive"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </button>
                      </form>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Menu */}
              <MobileNav user={session.user} onLogout={handleLogout} />
            </>
          )}
        </div>
      </div>
    </header>
  )
}