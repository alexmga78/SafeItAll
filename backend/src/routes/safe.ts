import { Router, Request, Response } from "express";
import prisma from "../prisma/prisma";

const router = Router();

// GET /user/:id - Fetch a user by ID
router.get("/user/:id", async (req: any, res: any) => {
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
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the user" });
  }
});

// Create /safe - Fetch all safes
router.post("/create", async (req: any, res: any) => {
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
    res
      .status(500)
      .json({ error: "An error occurred while creating the safe" });
  }
});

// GET /safe/:safe_id - Fetch a safe by its ID and check if the user has access or ownership
router.get("/open", async (req: any, res: any) => {
  const safe_id = req.body.safeId; // Extract safe ID from the route parameter
  const user_id = req.body.userId; // Extract user ID from the query parameters

  // Check if user_id is provided
  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  try {
    // Fetch the safe by safe_id
    const safe = await prisma.safe.findUnique({
      where: { id: parseInt(safe_id, 10) }, // Ensure the ID is parsed as an integer
      include: {
        owner: true, // Include the owner of the safe
        access_users: true, // Include the users who have access to the safe
      },
    });

    if (!safe) {
      return res.status(404).json({ error: "Safe not found" });
    }

    // Check if the user is the owner or has access to the safe
    const isOwner = safe.ownerId === parseInt(user_id, 10);
    const hasAccess = safe.access_users.some(
      (user) => user.id === parseInt(user_id, 10)
    );

    if (!isOwner && !hasAccess) {
      return res
        .status(403)
        .json({ error: "You don't have permission to access this safe" });
    }

    // Return the safe data
    res.status(200).json(safe);
  } catch (error) {
    console.error("Error fetching safe:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the safe" });
  }
});

router.post("/share-safe", async (req: any, res: any) => {
  const { safeId, userId, friendId } = req.body as {
    safeId: number;
    userId: number;
    friendId: number;
  };

  if (!safeId || !userId || !friendId) {
    return res.status(400).json({ error: "safeId and userId are required" });
  }

  try {
    // Fetch the safe by safeId
    const safe = await prisma.safe.findUnique({
      where: { id: safeId },
      include: { access_users: true },
    });

    if (!safe) {
      return res.status(404).json({ error: "Safe not found" });
    }

    // Fetch the user by userId
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ia-l si pe prieten
    const friend = await prisma.user.findUnique({
      where: { id: friendId },
    });

    if (!friend) {
      return res.status(404).json({ error: "n-ai prieteni haha" });
    }

    // Check if the user already has access to the safe
    const userHasAccess = safe.access_users.some(
      (accessUser) => accessUser.id === friendId
    );

    // Check if the userID is the one that created the safe
    let updatedSafe;
    if (safe.ownerId === userId) {
      // Add the friend to the safe's access_users array
      updatedSafe = await prisma.safe.update({
        where: { id: safeId },
        data: {
          access_users: {
            connect: { id: friendId },
          },
        },
      });
    } else {
      return res
        .status(403)
        .json({ error: "You are not the owner of the safe" });
    }

    res.status(200).json(updatedSafe);
  } catch (error) {
    console.error("Error sharing safe:", error);
    res.status(500).json({ error: "An error occurred while sharing the safe" });
  }
});

export default router;
