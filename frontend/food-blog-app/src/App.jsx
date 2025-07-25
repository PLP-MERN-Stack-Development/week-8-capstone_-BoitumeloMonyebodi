import React from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './pages/Home';
import MainNavigation from './components/MainNavigation';
import axios from 'axios';
import AddFoodRecipe from './pages/AddFoodRecipe';
import EditRecipe from './pages/EditRecipe';
import RecipeDetails from './pages/RecipeDetails';

// Base API URL
const API = 'http://localhost:5000';

// 🥗 Get all recipes from backend
const getAllRecipes = async () => {
  try {
    const res = await axios.get(`${API}/recipe`);
    return res.data;
  } catch (err) {
    console.error("Error fetching all recipes:", err);
    throw err;
  }
};

// 👨‍🍳 Get only recipes created by the logged-in user
const getMyRecipes = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const allRecipes = await getAllRecipes();
  return allRecipes.filter(item => item.createdBy === user?._id);
};

// ❤️ Get user's favorite recipes from localStorage
const getFavRecipes = () => {
  return JSON.parse(localStorage.getItem("fav")) || [];
};

// 🍽️ Get one recipe with author's email
const getRecipe = async ({ params }) => {
  try {
    const recipeRes = await axios.get(`${API}/recipe/${params.id}`);
    const recipe = recipeRes.data;

    const userRes = await axios.get(`${API}/user/${recipe.createdBy}`);
    return { ...recipe, email: userRes.data.email };
  } catch (err) {
    console.error("Error fetching single recipe:", err);
    throw err;
  }
};

// Set up React Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      { path: "/", element: <Home />, loader: getAllRecipes },
      { path: "/myRecipe", element: <Home />, loader: getMyRecipes },
      { path: "/favRecipe", element: <Home />, loader: getFavRecipes },
      { path: "/addRecipe", element: <AddFoodRecipe /> },
      { path: "/editRecipe/:id", element: <EditRecipe /> },
      { path: "/recipe/:id", element: <RecipeDetails />, loader: getRecipe }
    ]
  }
]);

// App Entry Point
export default function App() {
  return (
    <RouterProvider 
      router={router}
      fallbackElement={<p>Loading...</p>} // Fixes hydration fallback warning
    />
  );
}


