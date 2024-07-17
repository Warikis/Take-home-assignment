import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles/RecipesForm.module.css';
import { useNavigate} from 'react-router-dom';

function RecipesForm() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [numberOfPersons, setNumberOfPersons] = useState(1);
    const [totalTimeToPrepare, setTotalTimeToPrepare] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);
    
    const parseDuration = (duration) => {
        const [hoursPart, minutesPart] = duration.split('h');
        const hours = parseInt(hoursPart.trim()) || 0;
        const minutes = parseInt(minutesPart.trim().replace('m', '')) || 0;
        return hours * 3600 + minutes * 60;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('No token found. Please log in.');
            navigate('/login');
            return;
        }

        console.log(`Using token: ${token}`);

        const newRecipe = {
            name,
            description,
            number_of_persons: numberOfPersons,
            total_time_to_prepare: parseDuration(totalTimeToPrepare),
            ingredients,
            steps,
            video_url: videoUrl,
            image_url: imageUrl,
        };

        
        axios.post('http://localhost:8000/recipes/new/', newRecipe, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(response => {
            setName('');
            setDescription('');
            setNumberOfPersons(1);
            setTotalTimeToPrepare('');
            setIngredients('');
            setSteps('');
            setVideoUrl('');
            setImageUrl('');
            navigate('/recipes');
        })
        .catch(error => {
            console.error('There was an error creating the recipe!', error);
        });
    };

    

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="numberOfPersons">Number of Persons:</label>
                <input
                    type="number"
                    id="numberOfPersons"
                    value={numberOfPersons}
                    onChange={(e) => setNumberOfPersons(e.target.value)}
                    min="1"
                    required
                />
            </div>
            <div>
                <label htmlFor="totalTimeToPrepare">Total Time to Prepare:</label>
                <input
                    type="text"
                    id="totalTimeToPrepare"
                    value={totalTimeToPrepare}
                    onChange={(e) => setTotalTimeToPrepare(e.target.value)}
                    placeholder="e.g., 1h 30m"
                    required
                />
            </div>
            <div>
                <label htmlFor="ingredients">Ingredients:</label>
                <textarea
                    id="ingredients"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="steps">Steps:</label>
                <textarea
                    id="steps"
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="videoUrl">Video URL:</label>
                <input
                    type="url"
                    id="videoUrl"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="imageUrl">Image URL:</label>
                <input
                    type="url"
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}

export default RecipesForm;
