import argon2 from "argon2";

// Hash password
export const hashify = async (plainText) => {
    try {
        return await argon2.hash(plainText);
    } catch (err) {
        throw new Error("Error hashing password: " + err.message);
    }
};

// verify password
export const verifyHash = async (plainText, hashedText) => {
    try {
        return await argon2.verify(hashedText, plainText);
    } catch (err) {
        throw new Error("Error verifying password: " + err.message);
    }
}