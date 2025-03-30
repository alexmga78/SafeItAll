import { Router, Request, Response } from "express";
import prisma from "../prisma/prisma";

const router = Router();

// GET /user/:id - Fetch a user by ID
router.get('/user/:id', async (req: any, res: any) => {
    const { id } = req.params; // Extract user ID from the route parameter
  
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id, 10) }, // Ensure the ID is parsed as an integer
        include: {
          owned_safes: true, // Include safes owned by the user
          friend_safes: true, // Include safes the user has access to
        },
      });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'An error occurred while fetching the user' });
    }
  });

// Create /safe - Fetch all safes
router.post('/create', async (req: any, res: any) => {
    const { ownerId } = req.body as { ownerId: number };
  
    if (!ownerId) {
      return res.status(400).json({ error: "ownerId is required" });
    }
  
    try {
      // Fetch the user by ownerId
      const owner = await prisma.user.findUnique({
        where: { id: ownerId },
      });
  
      if (!owner) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Create the safe
      const newSafe = await prisma.safe.create({
        data: {
          ownerId, // Establish the relationship using the foreign key
          access_users: {
            connect: [], // Initialize with no additional users having access
          },
        },
      });
  
      res.status(201).json({ safe: newSafe, owner });
    } catch (error) {
      console.error("Error creating safe:", error);
      res.status(500).json({ error: "An error occurred while creating the safe" });
    }
  });

export default router;
