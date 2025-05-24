import { useState, useEffect } from "react";
import axios from "axios";
import "../../../public/css/style.css";

function Flashcard() {
    const [words, setWords] = useState([]);
    const [wordsApi, setWordsApi] = useState([]);
    const [flippedDb, setFlippedDb] = useState([]);
    const [flippedApi, setFlippedApi] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetchWords();
        fetchAPIWords();
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const response = await axios.get("/api/words");
            setFavorites(response.data);
        } catch (error) {
            console.error("Failed to fetch favorites", error);
        }
    };

    // Fetch from Database

    const fetchWords = async () => {
        try {
            const response = await axios.get("/api/words");
            setWords(response.data);
            setFavorites(response.data);
            setFlippedDb(new Array(response.data.length).fill(false));
        } catch (error) {
            console.error("Failed to fetch words", error);
        }
    };

    // Fetch from Finnfast API

    const fetchAPIWords = async () => {
        try {
            const response = await axios.get(
                "http://namecolor-react.test/api/finnfast-words?limit=10&page=1&all=false"
            );
            setWordsApi(response.data.words);
            setFlippedApi(new Array(response.data.words.length).fill(false));
        } catch (error) {
            console.error("Failed to fetch words", error);
        }
    };

    // Card Toggle
    const toggleFlipDb = (index) => {
        setFlippedDb((prev) => {
            const updated = [...prev];
            updated[index] = !updated[index];
            return updated;
        });
    };

    const toggleFlipApi = (index) => {
        setFlippedApi((prev) => {
            const updated = [...prev];
            updated[index] = !updated[index];
            return updated;
        });
    };

    // Check if word is already a favorite
    const isFavorite = (word) => {
        return favorites.some(
            (fav) =>
                fav.finnish === word.finnish &&
                fav.english === word.english &&
                fav.example === word.example
        );
    };

    // Add Word To The Database
    const handleAddToFavorite = async (word) => {
        if (isFavorite(word)) {
            alert("Already in favorites");
            return;
        }

        try {
            // Save to Database
            await axios.post("/api/words", {
                finnish: word.finnish,
                english: word.english,
                example: word.example,
            });

            fetchWords();
            // Update local favorites state
            setFavorites((prev) => [...prev, word]);

            alert("Added to favorites: " + word.finnish);
        } catch (error) {
            console.error("Failed to add favorite:", error);
            alert(
                "Failed to add favorite. It may already exist or there was a server error."
            );
        }
    };

    // Remove Word From The Database
    const handleRemoveFromFavorite = async (word) => {
        try {
            const match = favorites.find(
                (fav) =>
                    fav.finnish === word.finnish &&
                    fav.english === word.english &&
                    fav.example === word.example
            );

            if (!match?.id) return alert("Word not found in favorites.");

            await axios.delete(`/api/words/${match.id}`);
            await fetchWords();

            setFavorites(favorites.filter((fav) => fav.id !== match.id));
            alert(`Removed from favorites: ${word.finnish}`);
        } catch (error) {
            console.error("Failed to remove favorite:", error);
            alert("Failed to remove favorite. Please try again.");
        }
    };

    return (
        <>
            <h1>My Favorite Words</h1>
            <div className="flashcard-wrapper pt-8">
                {words.map((word, index) => (
                    <div
                        key={word.id}
                        className="flashcard"
                        onClick={() => toggleFlipDb(index)}
                    >
                        <div
                            className={
                                "flashcard-inner " +
                                (flippedDb[index] ? "flipped" : "")
                            }
                        >
                            <div className="flashcard-front">
                                {word.finnish}
                            </div>
                            <div className="flashcard-back">
                                <strong>{word.english}</strong>
                                <em>{word.example}</em>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h1>Words From API</h1>
            <div className="flashcard-wrapper pt-8">
                {wordsApi.map((word, index) => (
                    <div
                        key={word.id}
                        className="flashcard"
                        onClick={() => toggleFlipApi(index)}
                    >
                        <div
                            className={
                                "flashcard-inner " +
                                (flippedApi[index] ? "flipped" : "")
                            }
                        >
                            <div className="flashcard-front">
                                {word.finnish}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        isFavorite(word)
                                            ? handleRemoveFromFavorite(word)
                                            : handleAddToFavorite(word);
                                    }}
                                    className={`addToFav ${
                                        isFavorite(word) ? "favorited" : ""
                                    }`}
                                    aria-label={
                                        isFavorite(word)
                                            ? "Remove from favorites"
                                            : "Add to favorites"
                                    }
                                >
                                    {isFavorite(word) ? "❤️" : "🩶"}
                                </button>
                            </div>
                            <div className="flashcard-back">
                                <strong>{word.english}</strong>
                                <em>{word.example}</em>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Flashcard;
