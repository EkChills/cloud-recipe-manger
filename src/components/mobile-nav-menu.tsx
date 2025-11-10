"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, BookOpen, Plus, Compass, User, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface MobileNavProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  onLogout?: () => void
}

export default function MobileNav({ user, onLogout }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const NavLink = ({ href, icon: Icon, children, onClick }: any) => (
    <Link
      href={href}
      onClick={() => {
        setOpen(false)
        onClick?.()
      }}
      className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent transition-colors"
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{children}</span>
    </Link>
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full py-6">
          {/* User Info */}
          {user && (
            <>
              <div className="flex items-center gap-3 px-3 py-4 mb-4 bg-muted rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name?.substring(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{user.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <Separator className="mb-4" />
            </>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1">
            <NavLink href="/recipes" icon={BookOpen}>
              My Recipes
            </NavLink>
            <NavLink href="/recipes/new" icon={Plus}>
              Create Recipe
            </NavLink>
            <NavLink href="/discover" icon={Compass}>
              Discover
            </NavLink>

            {user && (
              <>
                <Separator className="my-4" />
                <NavLink href="/profile" icon={User}>
                  Profile
                </NavLink>
                <NavLink href="/settings" icon={Settings}>
                  Settings
                </NavLink>
              </>
            )}
          </nav>

          {/* Logout Button */}
          {user && onLogout && (
            <>
              <Separator className="my-4" />
              <Button
                variant="ghost"
                className="justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => {
                  setOpen(false)
                  onLogout()
                }}
              >
                <LogOut className="h-5 w-5" />
                Log out
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}