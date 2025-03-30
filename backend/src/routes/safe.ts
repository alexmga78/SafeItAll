import { Router, Request, Response } from "express";
import prisma from "../prisma/prisma";

const router = Router();

// GET /user/:id - Fetch a user by ID
router.get("/user/:id", async (req: any, res: any) => {
  const { id } = req.params; // Extract user ID from the route parameter

  try {
    const user = await prisma.user.findUnique({
      where: { id: id }, // Ensure the ID is parsed as an integer
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
  const { ownerId, text } = req.body as { ownerId: string; text: string };

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
        id: crypto.randomUUID(), // Generate a unique ID for the safe
        ownerId, // Establish the relationship using the foreign key
        text: text, // Add the text field if provided
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
router.post("/open", async (req: any, res: any) => {
  const safe_id = req.body.safeId; // Extract safe ID from the route parameter
  const user_id = req.body.userId; // Extract user ID from the query parameters

  // Check if user_id is provided
  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  try {
    // Fetch the safe by safe_id
    const safe = await prisma.safe.findUnique({
      where: { id: safe_id },
      include: {
        owner: true, // Include the owner of the safe
        access_users: true, // Include the users who have access to the safe
      },
    });

    if (!safe) {
      return res.status(404).json({ error: "Safe not found" });
    }

    // Check if the user is the owner or has access to the safe
    const isOwner = safe.ownerId === user_id;
    // Check if the user has access to the safe
    const query = `SELECT * FROM Hack.User_Safe WHERE safeId = "${safe_id}" AND userId = "${user_id}"`;

    const access:any = await prisma.$queryRawUnsafe(query);

    const hasAccess = access.length > 0; // Now false if no records exist
    console.log(access);
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
    safeId: string;
    userId: string;
    friendId: string;
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
      (accessUser) => accessUser.userId === friendId
    );

    // Check if the userID is the one that created the safe
    let updatedSafe;
    if (safe.ownerId === userId) {
      // Add the friend to the safe's access_users array
      updatedSafe = await prisma.user_Safe.create({
        data: {
          userId: friendId!,
          safeId: safeId,
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
