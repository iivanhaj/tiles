import express from "express";
import multer from "multer";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import supabase from "../lib/supabase";
import prisma from "../lib/prisma";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

router.post(
  "/upload",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "No file uploaded",
        });
      }

      console.log(req.file);

      const compressed = await sharp(Buffer.from(req.file.buffer))
        .resize(1080, 1080, {
          fit: "inside",
        })
        .jpeg({
          quality: 80,
        })
        .toBuffer();

      const filename = `${uuidv4()}.jpg`;

      const { error } = await supabase.storage
        .from("tiles")
        .upload(filename, compressed, {
          contentType: "image/jpeg",
        });

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from("tiles")
        .getPublicUrl(filename);

      res.json({
        imageUrl: data.publicUrl,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Upload failed",
      });
    }
  }
);

router.post("/", async (req, res) => {
  try {
    const {
      userId,
      imageUrl,
      caption,
      moodType,
      dateString,
    } = req.body;

    const existingTile = await prisma.tile.findFirst({
      where: {
        userId,
        dateString,
      },
    });

    if (existingTile) {
      return res.status(400).json({
        error: "Tile already exists for today",
      });
    }

    const tile = await prisma.tile.create({
      data: {
        userId,
        imageUrl,
        caption,
        moodType,
        dateString,
        sourceType: "upload",
        capturedAt: new Date(),
      },
    });

    res.json(tile);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Tile creation failed",
    });
  }
});

export default router;