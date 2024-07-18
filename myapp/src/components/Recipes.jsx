import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import styles from './styles/Recipes.module.css';



function Recipes({ recipeToEdit }) {
    const [recipes, setRecipes] = useState([]);
    const [editRecipeId, setEditRecipeId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const token = localStorage.getItem('token');

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

    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        let result = '';
        if (hours > 0) {
          result += `${hours} hour${hours > 1 ? 's' : ''} `;
        }
        if (minutes > 0) {
          result += `${minutes} minute${minutes > 1 ? 's' : ''}`;
        }
        return result.trim();
      }

    const startEdit = (id) => {
        setIsEditing(true);
        setEditRecipeId(id);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditRecipeId(null);
    };

    const saveEdit = (id) => {
        // Logic to save the edited recipe
        // After saving, exit edit mode:
        setIsEditing(false);
        setEditRecipeId(null);
        fetchRecipes();
    };

    const deleteRecipe = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/recipes/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            if (!response.ok) {
                throw new Error('Failed to delete the recipe');
            }
            // Optionally, fetch the updated list of recipes after deletion
            fetchRecipes();
        } catch (error) {
            alert("You do not have permission to delete this recipe.");
            console.error('Error deleting recipe:', error);
            // Handle the error (e.g., show an error message to the user)
        }
    };

    return (
        <div className={`${styles.container}`}>
            <h1>Recipes</h1>
            <Link to="/recipes/new">Add a new recipe</Link>
            <ul className={`${styles.recipeList}`}>
                {recipes.map(recipe => (
                    <li key={recipe.id} className={`${styles.recipeItem}`}>
                        <h2>{recipe.name}</h2>
                        <p>{recipe.description}</p>
                        <p>Servings: {recipe.number_of_persons}</p>
                        <p>Total time: {formatTime(recipe.total_time_to_prepare)}</p>
                        <h3><p>Ingredients:</p></h3>
                        <ul>
                            {recipe.ingredients.split('\n').map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                        <h4><p>Steps:</p></h4>
                        <ul>
                            {recipe.steps.split('\n').map((step, index) => (
                            <li key={index}>{step}</li>
                            ))}
                        </ul>
                        {recipe.video_url && <video src={recipe.video_url} controls />}
                        {recipe.image_url && <img src={recipe.image_url} alt={recipe.name} />}
                        {isEditing && editRecipeId === recipe.id ? (
                        <>
                            <button onClick={() => saveEdit(recipe.id)} className={`${styles.saveButton}`}>Save</button>
                            <button onClick={cancelEdit} className={`${styles.cancelButton}`}>Cancel</button>
                        </>
                        ) : (
                        <>
                            <button onClick={() => startEdit(recipe.id)} className={`${styles.editButton}`}>Edit</button>
                            <button onClick={() => deleteRecipe(recipe.id)} className={`${styles.deleteButton}`}>Delete</button>
                        </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Recipes;
