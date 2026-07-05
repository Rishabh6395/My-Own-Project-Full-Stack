
import express from 'express';
import db from '../db/db.js';

const router = express.Router();

router.post('/api/forms', async(req, res) =>{
    try{
        const {title, config} = req.body;

        const newForm = await db.query(
            "INSERT INTO forms (title, config) VALUES ($1, $2) RETURNING *",
            [title, JSON.stringify(config)]
        )
        res.status(201).json({ success: true, data: newForm.rows[0] });
    }
    catch(err:any){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

router.get('/api/forms/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const form = await db.query("SELECT * FROM forms WHERE id = $1", [id]);

        if (form.rows.length === 0) {
            return res.status(404).json({ message: "Form not found" });
        }

        res.json(form.rows[0]);
    } catch (err:any) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

export default router;
