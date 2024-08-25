import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["USER", "HR"],
            default: "USER",
        },
        gender: {
            type: String,
            enum: ["M", "F", "O"],
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            unique: true,
            sparse: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        address: {
            type: String,
        },
        education: {
            type: String,
        },
        skills: [
            {
                type: String,
            },
        ],
        experience: {
            type: String,
        },
        profileImage: {
            type: String,
        },
        jobsApplied: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Job",
            },
        ],
        savedJobs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Job",
            },
        ],
        company: {
            type: String,
        },
        companyImage: {
            type: String,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    console.log("Hashing the password")
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    console.log(this.password);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

userSchema.methods.checkToken = function (token) {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

export const User = mongoose.model("User", userSchema);