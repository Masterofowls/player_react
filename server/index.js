import "dotenv/config"
import cors from 'cors'
import pool from "./db.js";
import express from 'express';

const app = express()
app.use(cors())
const PORT = process.env.PORT || 3000

app.get("/ping",(req, res)=>{
    res.json({message: 'pong'})
})

app.get("/db-time", async (req, res)=>{
    try {
        const result = await pool.query("SELECT NOW()")
        res.json(result.rows[0])
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Database error"})
    }
})

app.get("/songs", async (req, res) => {
  try {
    const search = (req.query.search || "").trim();

    let result;
    if (search) {
      const pattern = "%" + search + "%";
      result = await pool.query(
        "SELECT * FROM songs WHERE title ILIKE $1 OR artist ILIKE $1 ORDER BY id",
        [pattern]
      );
    } else {
      result = await pool.query("SELECT * FROM songs ORDER BY id");
    }

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/songs/:id", async (req, res)=>{
    try {
        const id = Number(req.params.id)
        if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "Invalid id" });
        }
        const result = await pool.query("SELECT * FROM songs WHERE id=$1", [id])
        if (result.rows.length === 0) {
        return res.status(404).json({ error: "Book not found" });
        }
        res.json(result.rows[0])
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Database error"})
    }
})

app.listen(PORT, ()=>{
    console.log(`Server is running on  http://localhost:${PORT} `)
})