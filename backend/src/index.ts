import app from "./app";
import { PrismaClient } from "./generated/prisma";
export const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

const PORT = process.env.PORT || 5001;

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(
        `👉 Health check available at http://localhost:${PORT}/api/health`
      );
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    await prisma.$disconnect();
    process.exit(1); // Exit the process with failure code
  }
}

main();
