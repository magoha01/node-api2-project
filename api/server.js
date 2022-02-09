// implement your server here
const express = require("express");

const server = express();
server.use(express.json());
const postsRouter = require("./posts/posts-router");
server.use("/api/posts", postsRouter);

// require your posts router and connect it here

module.exports = server;
