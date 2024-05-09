import jwt from "jsonwebtoken"
import User from "../models/User.js"

const jwtAuth = async (req, res, next) => {
   const authorization = req.headers.authorization;
   if (!authorization)
     return res.status(401).json({ error: "Token Not Found" });

   // Extract the jwt token from the request headers
   const token = req.headers.authorization.split(" ")[1];
   if (!token) return res.status(401).json({ error: "Unauthorized" });

   try {
     // Verify the JWT token
     const decoded = jwt.verify(token, "machinesskey");

     // Attach user information to the request object
     req.user = decoded;
     next();
   } catch (err) {
     console.error(err);
     res.status(401).json({ error: "Invalid token" });
   }
}
const generateToken = (userData) => {
  return jwt.sign({ userData }, "machinesskey", { expiresIn: "1h" });
};

export { jwtAuth, generateToken };