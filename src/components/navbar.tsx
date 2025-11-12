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
import Link from "next/link"
import MobileNav from "./mobile-nav-menu"
import { ThemeToggle } from "./theme-toggle"
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-14 items-center justify-between mx-auto px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <span className="text-lg font-semibold tracking-tight">RecipeChef</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/recipes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Recipes
          </Link>
          <Link href="/recipes/new" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Create
          </Link>
          <Link href="/discover" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Discover
          </Link>
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {!session?.user ? (
            <form action={handleLogin}>
              <Button type="submit" size="sm" className="h-9 px-4 text-sm bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
                Sign in
              </Button>
            </form>
          ) : (
            <>
              {/* Desktop User Menu */}
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                        <AvatarFallback className="text-xs font-semibold">
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
                      <Link href="/profile" className="cursor-pointer text-sm">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/recipes" className="cursor-pointer text-sm">
                        My Recipes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer text-sm">
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <form action={handleLogout} className="w-full">
                        <button
                          type="submit"
                          className="w-full text-left text-sm text-destructive focus:text-destructive"
                        >
                          Sign out
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