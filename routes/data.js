const express = require("express");
const router = express.Router();
const db = require("../db");

console.log("DATA ROUTE LOADED");

router.get("/all", async (req, res) => {
    console.log("API /all HIT");
    
    try {
        const [activities] = await db.query(
            "SELECT * FROM activities"
        );

        const [teachers] = await db.query(
            "SELECT * FROM teachers"
        );

        const [students] = await db.query(
            "SELECT * FROM students"
        );

        res.json({
            activities,
            teachers,
            students
        });

    } catch (err) {
    console.error("ERROR DATA ROUTE:", err);

    res.status(500).json({
        success: false,
        error: err.message
    });
}
});

module.exports = router;