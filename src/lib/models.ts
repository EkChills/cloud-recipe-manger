export type Ingredient = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
};

export type Step = {
  id: string;
  content: string;
};

export type RecipeData = {
  details: Details | null;
    ingredients: Ingredient[];
    directions: Step[];
};

export type Details = {
    category: string;
    title: string;
    description?: string;
  };