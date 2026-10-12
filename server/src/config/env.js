import dotenv from "dotenv";

// load .env file
dotenv.config();

// helper to throw error if a required variable is missing
function requireEnv(key, defaultValue) {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
        throw new Error(`Missing required environment variable: ${ key }`);
    }
    return value;
}

// export config object
// Enforces some default value exists for every env variable,
// if not requireEnv() throws an error

export const config = {
    port: requireEnv("PORT", 4000),
    mongoUri: requireEnv("MONGO_URI"),
    accessTokenSecret: requireEnv("ACCESS_TOKEN_SECRET"),
    refreshTokenSecret: requireEnv("REFRESH_TOKEN_SECRET"),

    email: {
        from: requireEnv("EMAIL_FROM", "Solvify <onboarding@resend.dev>"),
        apiKey: requireEnv("RESEND_API_KEY", ""),
    },

    google: {
        clientId: requireEnv("GOOGLE_CLIENT_ID"),
        clientSecret: requireEnv("GOOGLE_CLIENT_SECRET"),
        apiKey: requireEnv("GEMINI_API_KEY"),
    },

    gemini: {
        apiKey: requireEnv("GEMINI_API_KEY"),
    },

    redirectUrl: requireEnv("REDIRECT_URL", "http://localhost:3000"),
};