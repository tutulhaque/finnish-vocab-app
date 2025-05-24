import { useState } from "react";
import NameColor from "./NameColor.jsx";
import Flashcard from "./Flashcard.jsx";

function App() {
    const [view, setView] = useState("namecolor");

    return (
        <div className="container" style={{ padding: "20px" }}>
            <button
                className="btn btn-default"
                onClick={() =>
                    setView((prev) =>
                        prev === "namecolor" ? "flashcards" : "namecolor"
                    )
                }
            >
                Switch to {view === "namecolor" ? "Flashcards" : "NameColor"}
            </button>

            {view === "namecolor" ? <NameColor /> : <Flashcard />}
        </div>
    );
}

export default App;
