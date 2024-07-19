import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './styles/Recipes.module.css';

function Recipes({ recipeToEdit }) {
    const [recipes, setRecipes] = useState([]);
    const [editRecipeId, setEditRecipeId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isStaff, setIsStaff] = useState(false);
    const token = localStorage.getItem('token');
    const apiUrl = process.env.REACT_APP_API_URL;

    const [editFormData, setEditFormData] = useState({
        name: '',
        description: '',
        number_of_persons: '',
        total_time_to_prepare: '',
        ingredients: '',
        steps: '',
        video_url: '',
        image_url: ''
    });

    useEffect(() => {
        const fetchCurrentUser = () => {
            axios.get(`http://3.86.198.216/api/current_user/`, {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                setCurrentUser(response.data.id); // Assuming the user object has an 'id' property
                setIsStaff(response.data.is_staff);
                //console.log('Current user:', response.data);
                //console.log('Current user ID:', response.data.id);
                //console.log('Is staff:', response.data.is_staff);
            })
            .catch(error => {
                console.error('There was an error fetching the current user!', error);
            });
        };

        fetchRecipes();
        if (token) {
            fetchCurrentUser();
        }
    }, [token]);


    const fetchRecipes = () => {
        axios.get(`http://3.86.198.216/recipes/`)
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

    const startEdit = (recipe) => {
        setIsEditing(true);
        setEditRecipeId(recipe.id);
        setEditFormData({
            name: recipe.name,
            description: recipe.description,
            number_of_persons: recipe.number_of_persons,
            total_time_to_prepare: recipe.total_time_to_prepare,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            video_url: recipe.video_url,
            image_url: recipe.image_url
        });
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditRecipeId(null);
        setEditFormData({
            name: '',
            description: '',
            number_of_persons: '',
            total_time_to_prepare: '',
            ingredients: '',
            steps: '',
            video_url: '',
            image_url: ''
        });
    };

    const handleEditFormChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value
        });
    };

    const saveEdit = (id) => {
        axios.put(`http://3.86.198.216/recipes/${id}/`, editFormData, {
            headers: {
                Authorization: `Token ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            // Update the recipe list with the edited recipe
            setRecipes(recipes.map(recipe => recipe.id === id ? response.data : recipe));
            // Exit edit mode
            setIsEditing(false);
            setEditRecipeId(null);
            fetchRecipes();
        })
        .catch(error => {
            alert("You do not have permission to edit this recipe.");
            console.error('There was an error updating the recipe!', error);
        });
    };

    const deleteRecipe = async (id) => {
        try {
            const response = await fetch(`http://3.86.198.216/recipes/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Token ${token}`
                }
            });
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

    //console.log('currentUser:', currentUser);

    return (
        <div className={`${styles.container}`}>
            <h1>Recipes</h1>
            <Link to="/recipes/new">Add a new recipe</Link>
            <ul className={`${styles.recipeList}`}>
                {recipes.map(recipe => (
                    <li key={recipe.id} className={styles.recipeItem}>
                    {isEditing && editRecipeId === recipe.id ? (
                        <form onSubmit={(e) => { e.preventDefault(); saveEdit(recipe.id); }}>
                            <div>
                                <label htmlFor="name">Name:</label>
                                <input type="text" name="name" value={editFormData.name} onChange={handleEditFormChange} required />
                            </div>
                            <div>
                                <label htmlFor="description">Description:</label>
                                <textarea name="description" value={editFormData.description} onChange={handleEditFormChange} required />
                            </div>
                            <div>
                                <label htmlFor="number_of_persons">Number of Persons:</label>
                                <input type="number" name="number_of_persons" value={editFormData.number_of_persons} onChange={handleEditFormChange} required />
                            </div>
                            <div>
                                <label htmlFor="total_time_to_prepare">Total Time to Prepare:</label>
                                <input type="text" name="total_time_to_prepare" value={editFormData.total_time_to_prepare} onChange={handleEditFormChange} required />
                            </div>
                            <div>
                                <label htmlFor="ingredients">Ingredients:</label>
                                <textarea name="ingredients" value={editFormData.ingredients} onChange={handleEditFormChange} required />
                            </div>
                            <div>
                                <label htmlFor="steps">Steps:</label>
                                <textarea name="steps" value={editFormData.steps} onChange={handleEditFormChange} required />
                            </div>
                            <div>
                                <label htmlFor="video_url">Video URL:</label>
                                <input type="url" name="video_url" value={editFormData.video_url} onChange={handleEditFormChange} />
                            </div>
                            <div>
                                <label htmlFor="image_url">Image URL:</label>
                                <input type="url" name="image_url" value={editFormData.image_url} onChange={handleEditFormChange} />
                            </div>
                            <button type="submit" className={styles.saveButton}>Save</button>
                            <button type="button" onClick={cancelEdit} className={styles.cancelButton}>Cancel</button>
                        </form>
                    ) : (
                        <>
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
                            {currentUser && (currentUser === recipe.user || isStaff)  && (
                                <>
                                    <button onClick={() => startEdit(recipe)} className={styles.editButton}>Edit</button>
                                    <button onClick={() => deleteRecipe(recipe.id)} className={styles.deleteButton}>Delete</button>
                                </>
                            )}
                        </>
                    )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Recipes;
