import { auth } from "@/auth";
import { RecipeData } from "@/lib/models";
import { db } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        const body: RecipeData = await req.json();
        const { details, ingredients, directions } = body;

        if (!details || !ingredients || !directions) {
            return new Response("Invalid data", { status: 400 });
        }


     await db.recipe.create({
        data: {
            title: details.title,
            description: details.description,
            steps: {
                createMany :{
                    data: directions.map((step) => ({content: step.content}))
                }
            },
            authorId: session?.user?.id || "",
            category: details.category,
            ingredients: {
                createMany: {
                    data: ingredients.map(ingredient => ({
                        name: ingredient.name,
                        quantity: ingredient.quantity,
                        price: ingredient.price,
                        measureType: ingredient.unit,
                    }))
                }
            }
        }
     })

     return NextResponse.json({ message: "Recipe saved successfully" }, { status: 201 });
    } catch (err: unknown) {
        console.log(err);
        console.error("Error saving recipe:", err);
        return new Response("Failed to save recipe", { status: 500 });
    }
}