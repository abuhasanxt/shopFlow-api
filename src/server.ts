import app from "./app";
import { envVars } from "./config/env";
import { seedAdmin } from "./utils/seed";

const PORT = envVars.PORT; // The port your express server will be running on.

// Start the server
const bootstrap =async () => {
  try {
    await seedAdmin()
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};
bootstrap();
