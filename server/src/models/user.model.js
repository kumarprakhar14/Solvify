import mongoose from "mongoose";
import argon2 from "argon2";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            minlength: 3,
            maxlength: 30,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false, 
        },
        roles: {
            type: [String],
            enum: ["user", "admin"],
            default: ["user"],
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        refreshTokens: {
            type: [String], 
            defautl: []
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    { timestamps: true }
);

/**
 * timestamps: true -
 * it’s an in-built schema option, not a field definition.
 * When we enable it,
 * Mongoose will automatically add two properties to every document:
 * - createdAt → Date when the document was first created.
 * - updatedAt → Date when the document was last updated.
 * 
 * Mongoose handles all the logic internally:
 * On document creation → sets both createdAt and updatedAt.
 * On every save() or update → updates only updatedAt.
 */



// Hash password before save
/**
 * pre -> it is a middleware hook by mongoose,
 * which helps us run certain logic before saving the model in DB.
 */
/**
 * isModified() -> 
 * Checks if the password is new/updated, if yes -> hash it.
 * Otherwise, skip hashing
 * Without this checkpoint, password will be hashed even when we save 
 * the model after updation (like, email change)
 * This will lead to double hashing -> login breaks (login will never work again)
 */
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await argon2.hash(this.password);
    next();
});

// Compare entered password with hashed password
/**
 * userSchema.methods - 
 * - Mongoose allows us to create instance methods on a schema
 * - These instance are available for every document create from that schema
 * 
 * We can define 2 types of methods on a mongoose schema:-
 * 1. Instance Methods(schema.methods) -> act on a document (e.g., user.comparePassword()).
 * 2. Static Methods(schema.statics) -> act on the model (e.g., User.findByEmail(email)).
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await argon2.verify(this.password, candidatePassword);
};

const User = mongoose.model("User", userSchema);

export default User;