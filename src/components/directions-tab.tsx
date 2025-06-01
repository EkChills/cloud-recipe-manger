"use client"

import type React from "react"

import { useState } from "react"
import { PlusCircle, Pencil, Trash2, Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RecipeData, Step } from "@/lib/models"



export function DirectionsTab({ onFinish, recipeData, isPending }: { onFinish: (steps: Step[]) => void, recipeData: RecipeData, isPending: boolean }) {
  const [steps, setSteps] = useState<Step[]>(recipeData.directions)
  const [newStepContent, setNewStepContent] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")

  const handleAddStep = () => {
    if (newStepContent.trim()) {
      const newStep: Step = {
        id: Date.now().toString(),
        content: newStepContent.trim(),
      }
      setSteps([...steps, newStep])
      setNewStepContent("")
    }
  }

  const handleEditStep = (step: Step) => {
    setEditingId(step.id)
    setEditContent(step.content)
  }

  const handleSaveEdit = () => {
    if (editContent.trim() && editingId) {
      setSteps(steps.map((step) => (step.id === editingId ? { ...step, content: editContent.trim() } : step)))
      setEditingId(null)
      setEditContent("")
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditContent("")
  }

  const handleFinish = () => {
    if (steps.length > 0) {
      onFinish(steps)
    } else {
        alert("Please add at least one cooking step before finishing.")
    }
  }

  const handleDeleteStep = (id: string) => {
    setSteps(steps.filter((step) => step.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      action()
    }
  }

  return (
    <div className="space-y-6">
      {/* Add New Step Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Cooking Step</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="new-step">Step {steps.length + 1}</Label>
            <Textarea
              id="new-step"
              placeholder="Describe what to do in this step (e.g., 'Preheat the oven to 350°F' or 'Mix flour and sugar in a bowl')"
              value={newStepContent}
              onChange={(e) => setNewStepContent(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, handleAddStep)}
              className="min-h-[100px] mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">Press Ctrl+Enter to add step quickly</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleAddStep} disabled={!newStepContent.trim()} className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Step
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Steps List */}
      {steps.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Cooking Directions</h3>
          {steps.map((step, index) => (
            <Card key={step.id} className="relative">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {editingId === step.id ? (
                      <div className="space-y-3">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          onKeyDown={(e) => handleKeyPress(e, handleSaveEdit)}
                          className="min-h-[100px]"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveEdit} disabled={!editContent.trim()}>
                            <Check className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm leading-relaxed">{step.content}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditStep(step)}>
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteStep(step.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground border rounded-md">
          No cooking steps added yet. Add your first step above to get started.
        </div>
      )}

      {/* Finish Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button size="lg" onClick={handleFinish} disabled={steps.length === 0 || !recipeData.details || !recipeData.directions || !recipeData.ingredients} className="bg-green-600 hover:bg-green-700">
            {isPending ? <Loader2 className="size-6 animate-spin" /> : "Save Recipe"}
          {/* {isPending ? <Loader2 className="size-6 animate-spin"> : "Save Recipe"} */}
        </Button>
      </div>
    </div>
  )
}
