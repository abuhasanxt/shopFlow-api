import app from "./app";

const PORT = process.env.PORT; // The port your express server will be running on.
console.log("🚀 ~ PORT:", PORT);

// Start the server
const bootstrap = () => {
  try {
    app.listen(5000, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};
bootstrap();
