import React, { useEffect, useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';

export default function RecipeItems() {
  const recipes = useLoaderData();
  const [allRecipes, setAllRecipes] = useState([]);
  const [favItems, setFavItems] = useState([]);
  const navigate = useNavigate();
  const isMyRecipePage = window.location.pathname === "/myRecipe";

  useEffect(() => {
    setAllRecipes(recipes);
    const storedFavs = JSON.parse(localStorage.getItem("fav")) || [];
    setFavItems(storedFavs);
  }, [recipes]);

  const onDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/recipe/${id}`);
      const updatedRecipes = allRecipes.filter(recipe => recipe._id !== id);
      setAllRecipes(updatedRecipes);

      const updatedFavs = favItems.filter(recipe => recipe._id !== id);
      setFavItems(updatedFavs);
      localStorage.setItem("fav", JSON.stringify(updatedFavs));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const toggleFavorite = (item) => {
    const isFav = favItems.some(recipe => recipe._id === item._id);
    let updatedFavs;

    if (isFav) {
      updatedFavs = favItems.filter(recipe => recipe._id !== item._id);
    } else {
      updatedFavs = [...favItems, item];
    }

    setFavItems(updatedFavs);
    localStorage.setItem("fav", JSON.stringify(updatedFavs));
  };

  return (
    <div className='card-container'>
      {allRecipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        allRecipes.map((item) => (
          <div
            key={item._id}
            className='card'
            onDoubleClick={() => navigate(`/recipe/${item._id}`)}
          >
            <img
              src={`http://localhost:5000/images/${item.coverImage}`}
              width="120px"
              height="100px"
              alt={item.title || "Recipe Image"}
            />
            <div className='card-body'>
              <div className='title'>{item.title}</div>
              <div className='icons'>
                <div className='timer'>
                  <BsStopwatchFill /> {item.time}
                </div>
                {!isMyRecipePage ? (
                  <FaHeart
                    onClick={() => toggleFavorite(item)}
                    style={{
                      color: favItems.some(res => res._id === item._id) ? "red" : "",
                      cursor: "pointer"
                    }}
                    title="Toggle Favorite"
                  />
                ) : (
                  <div className='action'>
                    <Link to={`/editRecipe/${item._id}`} className="editIcon" title="Edit Recipe">
                      <FaEdit />
                    </Link>
                    <MdDelete
                      onClick={() => onDelete(item._id)}
                      className='deleteIcon'
                      title="Delete Recipe"
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
