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
        //message: "The posts information could not be retrieved",
        errors: error.message,
      });
    });
});

//GET /api/posts/:id
//post_ with the specified `id` is not found: 404,message: "The post with the specified ID does not exist"
//error in retrieving the _post_ from the database: 500, message: "The post information could not be retrieved"

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

// router.post("/", async (req, res) => {
//   try {
//     if (!req.body.title || !req.body.contents) {
//       res.status(400).json({
//         message: "Please provide title and contents for the post",
//       });
//     } else {
//       const newPost = await Posts.insert(req.body);
//       res.status(201).json(newPost);
//     }
//   } catch (err) {
//     res.status(500).json({
//       message: "There was an error while saving the post to the database",
//       error: err.message,
//     });
//   }
// });

router.post("/", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      message: "Please provide title and contents for the post",
    });
  } else {
    Posts.insert(req.body)
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
      .then((updatedPost) => {
        if (updatedPost) {
          res.status(200).json(updatedPost.id);
        } else {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist" });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: "The post information could not be modified",
        });
      });
  }
});

//DELETE /api/posts/:id



//GET /api/posts/:id/comments

module.exports = router;
