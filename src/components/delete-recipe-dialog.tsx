"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DeleteRecipeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    recipeId: string
    recipeTitle: string
}

export function DeleteRecipeDialog({
    open,
    onOpenChange,
    recipeId,
    recipeTitle,
}: DeleteRecipeDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            const response = await fetch(`/api/recipe/delete/${recipeId}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Failed to delete recipe")
            }

            toast.success("Recipe deleted successfully")
            onOpenChange(false)
            router.refresh()
        } catch (error) {
            console.error("Error deleting recipe:", error)
            toast.error("Failed to delete recipe. Please try again.")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <DialogTitle>Delete Recipe</DialogTitle>
                    </div>
                    <DialogDescription className="pt-3">
                        Are you sure you want to delete <strong>{recipeTitle}</strong>? This action cannot be undone.
                        All ingredients and steps will be permanently removed.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete Recipe"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
