const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const AuthRouter = require("");
const UsersRouter = require("");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/auth", AuthRouter);
server.use("/api/users", UsersRouter);

server.get("/", (req, res) => {
	res.json({ api: "up" });
});

module.exports = server;
