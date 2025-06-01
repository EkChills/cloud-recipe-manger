"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Ingredient } from "@/lib/models"
import { Pencil, PlusCircle, Trash2 } from "lucide-react"
import { useState } from "react"


export function IngredientsTab({ onNext }: { onNext: (ingredients: Ingredient[]) => void}) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  const [newIngredient, setNewIngredient] = useState<Omit<Ingredient, "id">>({
    name: "",
    quantity: 0,
    unit: "",
    price: 0,
  })

  const handleNext = () => {
    onNext(ingredients)
  }

  const handleAddIngredient = () => {
    if (newIngredient.name && newIngredient.quantity && newIngredient.unit) {
      if (editingId) {
        // Update existing ingredient
        setIngredients(ingredients.map((ing) => (ing.id === editingId ? { ...newIngredient, id: editingId } : ing)))
        setEditingId(null)
      } else {
        // Add new ingredient
        setIngredients([...ingredients, { ...newIngredient, id: Date.now().toString() }])
      }

      // Reset form
      setNewIngredient({
        name: "",
        quantity: 0,
        unit: "",
        price: 0,
      })
    }
  }

  const handleEditIngredient = (ingredient: Ingredient) => {
    setNewIngredient({
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      price: ingredient.price,
    })
    setEditingId(ingredient.id)
  }

  const handleDeleteIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id))
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label className="mb-2"  htmlFor="ingredient-name">Ingredient Name</Label>
              <Input
                id="ingredient-name"
                placeholder="e.g., Flour"
                value={newIngredient.name}
                onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
              />
            </div>

            <div>
              <Label className="mb-2"  htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={newIngredient.quantity || ""}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    quantity: Number.parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div>
              <Label className="mb-2" htmlFor="unit">Measurement Type</Label>
              <Select
                value={newIngredient.unit}
                onValueChange={(value) => setNewIngredient({ ...newIngredient, unit: value })}
              >
                <SelectTrigger id="unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cups">cups</SelectItem>
                  <SelectItem value="grams">grams</SelectItem>
                  <SelectItem value="tablespoons">tablespoons</SelectItem>
                  <SelectItem value="teaspoons">teaspoons</SelectItem>
                  <SelectItem value="ounces">ounces</SelectItem>
                  <SelectItem value="pounds">pounds</SelectItem>
                  <SelectItem value="pieces">pieces</SelectItem>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="liters">liters</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2" htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={newIngredient.price || ""}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    price: Number.parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button type="button" onClick={handleAddIngredient} className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              {editingId ? "Update Ingredient" : "Add Ingredient"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {ingredients.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingredient</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredients.map((ingredient) => (
                <TableRow key={ingredient.id}>
                  <TableCell className="font-medium">{ingredient.name}</TableCell>
                  <TableCell>{ingredient.quantity}</TableCell>
                  <TableCell>{ingredient.unit}</TableCell>
                  <TableCell>${ingredient.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditIngredient(ingredient)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteIngredient(ingredient.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground border rounded-md">
          No ingredients added yet. Add your first ingredient above.
        </div>
      )}

      <div className="flex justify-end mt-8">
        <Button type="button" size="lg" onClick={handleNext} disabled={ingredients.length === 0}>
          Next
        </Button>
      </div>
    </div>
  )
}
