import mongoose from "mongoose";

const barberSchema = new mongoose.Schema(
    {
        dni: { type: Number, unique: true, require: true, trim: true },
        fullName: { type: String, require: true, trim: true },
        phoneNumber: { type: Number, require: true, unique: true, trim: true },
        email: { type: String, require: true, unique: true, trim: true },
        password: { type: String, require: true, trim: true },
        role: {
            type: String,
            enum: ["barber"],
            default: "barber",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Barbers", barberSchema);
