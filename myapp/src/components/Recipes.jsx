import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import styles from './styles/Recipes.module.css';

const formatDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return `${hours}h ${minutes}m`;
};

function Recipes() {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = () => {
        axios.get('http://localhost:8000/recipes/')
            .then(response => {
                setRecipes(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the recipes!', error);
            });
    };

    const handleFormSubmit = (newRecipe) => {
        setRecipes([...recipes, newRecipe]);
    };

    return (
        <div className={styles.container}>
            <h1>Recipes</h1>
            <Link to="/recipes/new">Add a new recipe</Link>
            <ul className={styles.recipeList}>
                {recipes.map(recipe => (
                    <li key={recipe.id} className={styles.recipeItem}>
                        <h2>{recipe.name}</h2>
                        <p>{recipe.description}</p>
                        <p>Serves: {recipe.number_of_persons}</p>
                        <p>Total time: {recipe.total_time_to_prepare}</p>
                        <p>Ingredients: {recipe.ingredients}</p>
                        <p>Steps: {recipe.steps}</p>
                        {recipe.video_url && <video src={recipe.video_url} controls />}
                        {recipe.image_url && <img src={recipe.image_url} alt={recipe.name} />}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Recipes;
