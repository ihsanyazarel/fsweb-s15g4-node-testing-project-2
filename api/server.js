const express = require("express");
const postRouter = require("./posts/posts-router");
const commentsRouter = require("./comments/comments-router");

const server = express();
server.use(express.json());
server.use("/api/posts", postRouter);
server.use("/api/comments", commentsRouter);

module.exports = server;