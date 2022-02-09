// implement your posts router here
const router = require("express").Router();
const Posts = require("./posts-model");

//GET /api/posts

router.get("/", (req, res) => {
  Posts.find(req.query)
    .then((allPosts) => {
      res.json(allPosts);
    })
    .catch((error) => {
      res.status(500).json({
        errors: error.message,
      });
    });
});

//GET /api/posts/:id

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (!post) {
        res.status(404).json({
          message: "The post with the specified ID does not exist",
        });
      } else {
        res.json(post);
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "The post information could not be retrieved",
        error: err.message,
      });
    });
});

//POST /api/posts

router.post("/", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      message: "Please provide title and contents for the post",
    });
  } else {
    Posts.insert(req.body)
      .then(({ id }) => {
        return Posts.findById(id);
      })
      .then((newPost) => {
        res.status(201).json(newPost);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: "There was an error while saving the post to the database",
        });
      });
  }
});

//PUT /api/posts

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { body } = req;

  if (!id) {
    res.status(404).json({
      message: "The post with the specified ID does not exist",
    });
  } else if (!body.title || !body.contents) {
    res.status(400).json({
      message: "Please provide title and contents for the post",
    });
  } else {
    Posts.update(id, body)
      .then(() => {
        return Posts.findById(id);
      })
      .then((updatedPost) => {
        if (updatedPost) {
          res.status(200).json(updatedPost);
        } else {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist" });
        }
      })
      .catch((error) => {
        res.status(500).json({
          message: "The post information could not be modified",
          error: error.message,
        });
      });
  }
});

//DELETE /api/posts/:id

router.delete("/:id", async (req, res) => {
  try {
    const maybe = await Posts.findById(req.params.id);
    if (!maybe) {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    } else {
      const deletedPost = await Posts.remove(req.params.id);
      res.json(deletedPost)
    }
  } catch (err) {
    res.status(500).json({
      message: "The post could not be removed",
      error: err.message,
    });
  }
});

//GET /api/posts/:id/comments

router.get("/:id/comments", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    } else {
      const comments = await Posts.findPostComments(req.params.id);
      res.json(comments);
    }
  } catch (err) {
    res.status(500).json({
      message: "The comments information could not be retrieved",
      error: err.message,
    });
  }
});

module.exports = router;
