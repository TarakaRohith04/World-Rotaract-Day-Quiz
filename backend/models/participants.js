import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    club: { type: String, required: true },
    position: { type: String, required: true },
    whatsapp: { type: String, required: true, unique: true },
    gmail: { type: String, required: true },
    score: { type: Number, default: 0 },
    total: { type: Number, default: 50 },
    cheated: { type: Boolean, default: false },
    questions: { type: Array, default: [] },
    answers: { type: Object, default: {} },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const Participant = mongoose.model("Participant", ParticipantSchema);

export default Participant;
