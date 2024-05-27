const express = require("express");
const app = express();
const port = 5000;
app.use(express.json());

const db = require("./firebase");
const { collection, getDocs, updateDoc, doc, addDoc, deleteDoc } = require("firebase/firestore");

const cors = require("cors");
app.use(cors());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// get all posts
app.get("/posts", async (req, res) => {
    try {
        let ret = [];
        const querySnapshot = await getDocs(collection(db, "posts"));
        querySnapshot.forEach((doc) => {
            ret.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        res.status(200).json(ret);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// like a post
// app.put("/posts/:id", async (req, res) => {
//     try {
//         const id = req.params.id;
//         const currentLikes = req.body.currentLikes;
//         await updateDoc(doc(db, "users", id), {
//             likes: currentLikes + 1,
//         });
//         res.status(200).json({ message: "success" });
//     } catch (e) {
//         res.status(400).json({ error: e.message });
//     }
// });

app.put("/posts/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { name, text } = req.body;
        await updateDoc(doc(db, "posts", id), {
            name: name,
            text: text,
        });
        res.status(200).json({ message: "success" });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// add a user
app.post("/posts", async (req, res) => {
    try {
        const name = req.body.name;
        const text = req.body.text;
        const docRef = await addDoc(collection(db, "posts"), {
            name: name,
            text: text,
        });
        res.status(200).json({message: `Successfully created post with id ${docRef.id}`})
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// remove a post
app.delete("/posts/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const postDoc = doc(db, "posts", id);
        await deleteDoc(postDoc);
        res.status(200).json({ message: `Successfully deleted post with id ${id}` });
    } catch (error) {
        res.status(400).json({ error: e.message });
    }
})