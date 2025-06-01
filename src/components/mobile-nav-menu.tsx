"use client"

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { BookOpen, ChefHat, LogOut, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import {signOut} from "next-auth/react"
import { DialogTitle } from "@radix-ui/react-dialog";


export default function MobileNavMenu() {

    const handleLogout = async () => {
        await signOut({redirectTo: "/"})
    }
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    return (
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <DialogTitle><span className="sr-only">Toggle menu</span></DialogTitle>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between border-b py-4">
                        <div className="flex items-center gap-2">
                            <ChefHat className="h-6 w-6 text-primary" />
                            <span className="font-bold">RecipeChef</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Mobile User Profile */}
                    <div className="flex items-center gap-4 border-b py-6">
                        <Avatar className="h-10 w-10 border">
                            <AvatarImage src="/placeholder.svg" alt="User" />
                            <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">John Doe</p>
                            <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex flex-col gap-1 py-4">
                        <Link
                            href="/recipes"
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent rounded-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <BookOpen className="h-4 w-4" />
                            My Recipes
                        </Link>
                        <Link
                            href="/recipes/new"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-accent rounded-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <ChefHat className="h-4 w-4" />
                            Create Recipe
                        </Link>
                        <Link
                            href="/discover"
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent rounded-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <BookOpen className="h-4 w-4" />
                            Discover
                        </Link>
                    </nav>

                    {/* Mobile Menu Footer */}
                    <div className="mt-auto border-t py-4">
                        <Button
                            variant="ghost"
                            className="flex w-full items-center justify-start gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4" />
                            Log out
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}