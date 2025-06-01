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
import { BookOpen, ChefHat, LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import MobileNavMenu from "./mobile-nav-menu"
import { auth, signIn, signOut } from "@/auth"


export async function Navbar() {

    const session = await auth()

    const handleLogout = async() => {
        "use server"
        await signOut({redirectTo: "/"})
    }

    const handleLogin = async() => {
        "use server"

        await signIn("google", {redirectTo: "/recipes/new"})
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mx-auto ">
            <div className="container flex h-16 items-center justify-between mx-auto">
                {/* Logo and Brand */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <ChefHat className="h-6 w-6 text-primary" />
                        <span className="text-lg font-bold">RecipeChef</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/recipes" className="text-sm font-medium hover:text-primary transition-colors">
                        My Recipes
                    </Link>
                    <Link
                        href="/recipes/new"
                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                        Create Recipe
                    </Link>
                    <Link href="/discover" className="text-sm font-medium hover:text-primary transition-colors">
                        Discover
                    </Link>
                </nav>

                {/* User Menu (Desktop) */}
                <form action={handleLogin}>
                {!session?.user && <Button type="submit">Login</Button>}

                </form>
                {session?.user && <div className="hidden md:flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                { <Avatar className="h-10 w-10 border">
                                    <AvatarImage src={session.user.image || ""} alt="User" />
                                    <AvatarFallback className="bg-primary/10 text-primary">{session.user.name?.substring(0,2)}</AvatarFallback>
                                </Avatar> }
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">{session.user.name}</p>
                                    <p className="text-xs text-muted-foreground">{session.user.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/profile" className="cursor-pointer flex w-full items-center">
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/recipes" className="cursor-pointer flex w-full items-center">
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    My Recipes
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/settings" className="cursor-pointer flex w-full items-center">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="cursor-pointer text-destructive focus:text-destructive"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>}

                {/* Mobile Menu Button */}
                <MobileNavMenu />
            </div>
        </header>
    )
}
