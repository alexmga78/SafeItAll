// import { Router } from "express";
// import prisma from "../src/prisma/prisma"; // Adjust the path based on your directory structure

// const router = Router();

// // GET /users - Fetch all users
// router.get("/", async (req, res) => {
//   try {
//     const users = await prisma.user.findMany();
//     res.json(users);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ error: "An error occurred while fetching users" });
//   }
// });

// // POST /users - Create a new user
// router.post("/", async (req, res) => {
//   const { name, email } = req.body;
//   try {
//     const newUser = await prisma.user.create({
//       data: { name, email },
//     });
//     res.status(201).json(newUser);
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(500).json({ error: "An error occurred while creating the user" });
//   }
// });

// export default router;
