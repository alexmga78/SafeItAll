import express from "express";
// import userRoutes from "../routes/user";

import { PrismaClient } from '@prisma/client'
import safeRoutes from "./routes/safe";
const prisma = new PrismaClient()

async function main() {
	const app = express();

	// Middleware to parse JSON bodies
	app.use(express.json());
	
	// Mount routes from the routes directory
	app.use("/safe", safeRoutes);
	
	const PORT = process.env.PORT || 3000;
	
	app.listen(PORT, async () => {

	  console.log(`Server is running on port ${PORT}`);
	  try {
		// Test the database connection
		await prisma.$connect();
		console.log("Connected to MySQL database successfully.");
	  } catch (error) {
		console.error("Error connecting to the database:", error);
		process.exit(1);
	  }
	});
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })