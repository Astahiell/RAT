require("module-alias/register");
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const logger = require("@middleware/logger");
const asyncWrapper = require("@middleware/asyncWrapper");
const apiRouter = require("@routes/api");
const notFoundMiddleware = require("@middleware/not-found");
const errorHandlerMiddleware = require("@middleware/error-handler");

app.use(express.json());
app.use(helmet());
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);
app.use(cors());
app.use("/api/v1", apiRouter);
// app.use(notFoundMiddleware);
// app.use(errorHandlerMiddleware);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const port = process.env.PORT || 5000;

const start = asyncWrapper(async () => {
  app.listen(port, () => {
    logger.log({
      level: "info",
      message: "App started",
    });
    console.log(`Server is listening on port ${port}`);
  });
});
start();
