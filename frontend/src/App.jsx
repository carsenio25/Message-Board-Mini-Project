import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
    const [name, setName] = useState("");
    const [text, setText] = useState("");
    const [allData, setAllData] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editingPost, setEditingPost] = useState({});

    const fetchData = async () => {
        const response = await axios.get("http://localhost:5000/posts");
        console.log("response", response.data);
        setAllData(response.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = {
            name: name,
            text: text,
        };
        const response = await axios.post("http://localhost:5000/posts", body);
        console.log(response)
        fetchData();
    };

    const handleEdit = (user) => {
      setEditingId(user.id)
      setEditingPost(user)
    }

    const handleSave = async (id) => {
      try {
        const response = await axios.put(`http://localhost:5000/posts/${id}`, editingPost);
        console.log(response);
        fetchData();
        setEditingId(null);
        setEditingPost({});
        // fetchData();
      }
      catch (error){
        console.log("Error saving update:", error)
      }
    }

    const handleCancel = (user) => {
      setEditingId(null)
      setEditingPost({})
    }

    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditingPost({ ...editingPost, [name]: value });
  };

    const handleDelete = async (id) => {
      try {
        const response = await axios.delete(`http://localhost:5000/posts/${id}`);
        console.log(response);
        fetchData();
    } catch (error) {
        console.error("Error deleting post:", error);
    }
  };

    // const likeUser = async (id, currentLikes) => {
    //     const response = await axios.put(`http://localhost:5000/posts/${id}`, {
    //         currentLikes: currentLikes,
    //     });
    //     fetchData();
    // };

    return (
        <>
            <h1>Welcome!</h1>
            <form onSubmit={handleSubmit}>
                <label> Name: </label>
                <input type="text" onChange={(e) => setName(e.target.value)}></input>
                <br></br>
                <label> Text: </label>
                <input type="text" onChange={(e) => setText(e.target.value)}></input>
                <br></br>
                <button type="submit">Post</button>
            </form>
            <div>
                <h2>Posts:</h2>
                {allData.map((user, index) => (
                    <div key={index} style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                      {editingId !== user.id ? (
                        <>
                    {`${user.name}: ${user.text}`}
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                        </>

                      ): (
                        <>
                        <h3>Now Editing</h3>
                        <input type="text" name="name" value={editingPost.name} onChange={handleChange}></input>
                        <input type="text" name="text" value={editingPost.text} onChange={handleChange}></input>
                        <button onClick={() => handleCancel(user)}>Cancel</button>
                        <button onClick={() => handleSave(user.id)}>Save</button>
                        </>
                      )}
                    </div>
                ))}
            </div>
        </>
    );
}

export default App;