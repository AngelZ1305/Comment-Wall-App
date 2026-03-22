const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });


const users = require("./data/users");
const commentsStore = require("./data/commentsStore");
const { JWT_SECRET, CORS_ORIGIN, IS_PRODUCTION, normalizeOrigin } = require("./config");
const createAuthenticateToken = require("./middleware/authenticateToken");
const createAuthRouter = require("./routes/authRoutes");
const createCommentsRouter = require("./routes/commentsRoutes");

const app = express();
const authenticateToken = createAuthenticateToken(JWT_SECRET);
const localhostOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

function isAllowedOrigin(origin) {
  if (!origin || origin === "null") return true;

  const normalizedOrigin = normalizeOrigin(origin);

  if (CORS_ORIGIN.length === 0) return true;
  if (CORS_ORIGIN.includes(normalizedOrigin)) return true;
  if (!IS_PRODUCTION && localhostOriginPattern.test(normalizedOrigin)) return true;

  return false;
}

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 204
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use("/", createAuthRouter({ users, jwtSecret: JWT_SECRET }));
app.use("/comments", createCommentsRouter({ authenticateToken, commentsStore, users }));

module.exports = app;
