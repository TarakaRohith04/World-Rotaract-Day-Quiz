import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

import Participant from "./models/participants.js";

const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Connection Error:", err));

// Routes
app.post("/api/attempts", async (req, res) => {
    try {
        const newAttempt = new Participant(req.body);
        await newAttempt.save();
        res.status(201).json({ message: "Attempt saved successfully" });
    } catch (err) {
        console.error("Error saving attempt:", err);
        res.status(500).json({ error: "Failed to save attempt" });
    }
});

app.get("/api/attempts", async (req, res) => {
    try {
        const attempts = await Participant.find().sort({ timestamp: -1 });
        res.json(attempts);
    } catch (err) {
        console.error("Error fetching attempts:", err);
        res.status(500).json({ error: "Failed to fetch attempts" });
    }
});

app.get("/", (req, res) => {
    res.send("Backend running");
});

app.get("/api/test", (req, res) => {
    res.send("API is working");
});

app.post("/register", async (req, res) => {
    try {
        const { name, clubName, position, phone, email } = req.body;

        const participant = new Participant({
            name,
            clubName,
            position,
            phone,
            email
        });

        await participant.save();
        res.status(201).json({ message: "Participant registered successfully" });

    } catch (error) {
        console.error("Error registering participant:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
