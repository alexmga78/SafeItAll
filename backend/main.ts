import express from "express";
import { PrismaClient } from "@prisma/client";
import userRoutes from "./routes/user";

const app = express();
const prisma = new PrismaClient();

// Middleware to parse JSON bodies
app.use(express.json());

// Mount routes from the routes directory
app.use("/users", userRoutes);

// You can similarly mount other route groups:
// app.use('/products', productRoutes);
// app.use('/orders', orderRoutes);

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

// Gracefully shutdown Prisma client on process termination
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
