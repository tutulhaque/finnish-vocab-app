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
    }, []);

    const fetchWords = async () => {
        try {
            const response = await axios.get("/api/words");
            setWords(response.data);
            setFlippedDb(new Array(response.data.length).fill(false));
        } catch (error) {
            console.error("Failed to fetch words", error);
        }
    };

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
        return favorites.some((fav) => fav.id === word.id);
    };

    const handleAddToFavorite = async (word) => {
        if (isFavorite(word)) {
            console.log("Already in favorites");
            return;
        }

        try {
            // Save to Database
            await axios.post("/api/words", {
                finnish: word.finnish,
                english: word.english,
                example: word.example,
            });

            // Update local favorites state
            setFavorites((prev) => [...prev, word]);

            alert("Added to favorites:", word);
        } catch (error) {
            console.error("Failed to add favorite:", error);
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
                                <button>❤️</button>
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
