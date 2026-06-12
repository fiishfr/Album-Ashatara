    const mysql = require("mysql2/promise");

    console.log("DB CONFIG LOADED");
    
    const pool = mysql.createPool({
        host: "localhost",
        user: "root",
        password: "",
        database: "album_sekolah",
        waitForConnections: true,
        connectionLimit: 10
    });

    console.log("PASSWORD SDH KOSONG");

    module.exports = pool;