import { useState, useEffect } from "react";
import axios from "axios";
import "../../../public/css/style.css";

const NameColor = () => {
    const [nameColors, setNameColors] = useState([]);
    const [error, setError] = useState(null);
    const [name, setName] = useState("");
    const [color, setColor] = useState("");
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchNameColors();
    }, []);

    const fetchNameColors = async () => {
        try {
            const response = await axios.get("/api/name-colors");
            setNameColors(response.data);
        } catch (err) {
            setError("Failed to fetch entries");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/name-colors", { name, color });
            setName("");
            setColor("");
            fetchNameColors();
        } catch (err) {
            setError("Failed to add entry");
        }
    };
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`/api/name-colors/${editId}`, { name, color });
            setEditId(null);
            setName("");
            setColor("");
            fetchNameColors();
        } catch (err) {
            setError("Failed to Edit entry");
        }
    };

    const handleEdit = (item) => {
        setName(item.name);
        setColor(item.color);
        setEditId(item.id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/name-colors/${id}`);
            fetchNameColors();
        } catch {
            setError("Failed to delete entry");
        }
    };

    return (
        <main className="container">
            <h1>Name and Color Manager</h1>
            {error && <div className="alert">{error}</div>}

            <form onSubmit={editId ? handleEditSubmit : handleSubmit}>
                <div>
                    <label className="label">Name</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label className="label">Color</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="Color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-default">
                    {editId ? "Update" : "Add"}
                </button>
            </form>

            {nameColors.length > 0 && (
                <>
                    <h2>Stored Names and Colors</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Color</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nameColors.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.color}</td>
                                    <td>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "5px",
                                            }}
                                        >
                                            <button
                                                className="btn"
                                                onClick={() => handleEdit(item)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn"
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </main>
    );
};

export default NameColor;
