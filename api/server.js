// implement your server here
const express = require("express");

const server = express();

const postsRouter = require("./posts/posts-router");

// require your posts router and connect it here
server.use("./api/posts", postsRouter);

module.exports = server;
