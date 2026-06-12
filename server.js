require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
console.log("Server 2");

app.use(cors());
app.use(express.json());

// melayani file frontend
app.use(express.static(__dirname));

app.use(
    "/assets",
    express.static(path.join(__dirname, "assets"))
);
app.use(express.static(__dirname));
app.use("/api", require("./routes/data"));
app.use("/api/upload", require("./routes/upload"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/test", (req, res) => {
    res.send("TEST BERHASIL");
});

console.log("SERVER ASHATARA AKTIF");

app.get("/cek", (req, res) => {
    res.send("ASHATARA SERVER");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});