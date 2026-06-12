const db = require("./db");

(async () => {
    try {
        const [rows] = await db.query("SELECT USER(), DATABASE()");
        console.log(rows);
    } catch (err) {
        console.error(err);
    }
})();