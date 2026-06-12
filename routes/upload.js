const express = require("express");
const router = express.Router();

const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

const db = require("../db");

const upload = multer({
    storage: multer.memoryStorage()
});

router.post(
    "/photo",
    upload.single("photo"),
    async (req, res) => {

        try {

            if (!req.file) {
                return res.json({
                    success: false,
                    message: "File tidak ditemukan"
                });
            }

            const filename =
                "img_" +
                Date.now() +
                ".webp";

            const outputPath = path.join(
                __dirname,
                "../assets/MOMENT",
                filename
            );

            await sharp(req.file.buffer)
                .webp({ quality: 80 })
                .toFile(outputPath);

            const title =
                req.body.title ||
                "Tanpa Judul";

            const category =
                req.body.category ||
                "lainnya";

            const image =
                "assets/MOMENT/" +
                filename;

            await db.query(
                `INSERT INTO activities
                (title, category, image)
                VALUES (?, ?, ?)`,
                [title, category, image]
            );

            res.json({
                success: true,
                message: "Upload berhasil"
            });

        } catch (err) {

            res.status(500).json({
                success: false,
                error: err.message
            });

        }
    }
);

module.exports = router;