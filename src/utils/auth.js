const { createClient } = require("@supabase/supabase-js");
const logger = require("./logger");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// Create a separate client for auth verification
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Auth middleware that verifies Supabase JWT tokens.
 * Extracts user from the token and attaches to req.user
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Get token from Authorization header or query param (for downloads)
        let token = null;

        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        } else if (req.query.token) {
            // For browser downloads that can't set headers
            token = req.query.token;
        }

        if (!token) {
            logger.log(`[${req.id}] [Auth] No token provided`);
            return res.status(401).json({ error: "Authentication required" });
        }

        // Verify the token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            logger.log(`[${req.id}] [Auth] Invalid token: ${error?.message || "No user"}`);
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        // Attach user to request
        req.user = user;
        req.userId = user.id;

        logger.log(`[${req.id}] [Auth] Authenticated: ${user.email}`);
        next();
    } catch (err) {
        logger.error(`[${req.id}] [Auth] Error:`, err.message);
        return res.status(500).json({ error: "Authentication error" });
    }
};

/**
 * Optional auth middleware - doesn't fail if no token, just doesn't set user
 */
const optionalAuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.substring(7);
            const { data: { user } } = await supabase.auth.getUser(token);
            if (user) {
                req.user = user;
                req.userId = user.id;
            }
        }
        next();
    } catch (err) {
        // Silently continue without auth
        next();
    }
};

module.exports = { authMiddleware, optionalAuthMiddleware };
