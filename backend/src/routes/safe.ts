import { Router, Request, Response } from "express";
import prisma from "../prisma/prisma";

const router = Router();

// Create /safe - Fetch all safes
router.post('/safe', async (req: Request, res: Response) => {
    const { ownerId, name } = req.body as { ownerId: number; name: string };

    if (!ownerId || !name) {
        return res.status(400).json({ error: "ownerId and name are required" });
    }

    try {
        const newSafe = await prisma.safe.create({
            data: {
                ownerId,
                name,
                access_users: {
                    connect: [],
                },
            },
        });

        res.status(201).json(newSafe);
    } catch (error) {
        console.error("Error creating safe:", error);
        res.status(500).json({ error: "An error occurred while creating the safe" });
    }
});

export default router;
