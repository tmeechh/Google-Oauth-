import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    // Get the token from the Authorization header or the cookies
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Please log in again." });
    }

    try {
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedToken.id; // Store the user ID from the token in the request object for use in other routes
        next(); // Move on to the next middleware or route handler
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Token Error. Invalid or expired token." });
    }
};

export default authMiddleware;
