require("dotenv").config();
const cookieParser = require("cookie-parser");
const createServer = require("./server");
const jwt = require("jsonwebtoken");
const db = require("./db");
const server = createServer();
server.express.use(cookieParser());

server.express.use((req, res, next) => {
  const { Token } = req.cookies;
  if (Token) {
    const { userId } = jwt.verify(Token, process.env.APP_SECRET);
    // put the userId onto the req for future requests to access
    req.userId = userId;
  }
  next();
});

//Create a middleware that populates the user on each request
server.express.use(async (req, res, next) => {
  // if they aren't logged in, skip this
  if (!req.userId) return next();

  const user = await db.query.user(
    { where: { id: req.userId } },
    "{ id, permissions, email, name }"
  );

  req.user = user;

  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`Server is now running on port http://localhost:${deets.port}`);
  }
);
