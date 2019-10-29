const express = require("express");
const db = require("../data/db");

const router = express.Router();

router.get("/", (req, res) => {
  db.find(req.query)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "The posts information could not be retrieved."
      });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "The post information could not be retrieved"
      });
    });
});

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  db.findById(id).then(post => {
    if (!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist."
      });
    } else {
      db.findPostComments(id)
        .then(comments => {
          res.status(200).json(comments);
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({
            message: "The comments information could not be retrieved."
          });
        });
    }
  });
});

router.post("/", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({
      message: "Please provide title and contents for the post."
    });
  } else {
    db.insert(req.body)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          message: "There was an error while saving the post to the database"
        });
      });
  }
});
//Look at how to return a better response than just the post id

router.post("/:id/comments", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text) {
    res.status(404).json({
      message: "The post with the specified ID does not exist."
    });
  } else {
    db.findById(id)
      .then(post => {
        if (!post) {
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        } else {
          db.insertComment(text)
            .then(comment => {
              res.status(201).json(comment);
            })
            .catch(() => {
              res.status(500).json({
                message:
                  "There was an error while saving the comment to the database"
              });
            });
        }
      })
      .catch(() => {
        res.status(500).json({
          message: "There was an error while saving the comment to the database"
        });
      });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(post => {
      if (post.length === 0) {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      } else {
        db.remove(id)
          .then(() => {
            res.status(200).json({
              message: "Delete post success"
            });
          })
          .catch(() => {
            res.status(500).json({
              message: "The post could not be removed"
            });
          });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: "The post could not be removed"
      });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({
      message: "Please provide title and contents for the post."
    });
  } else {
    db.findById(id).then(post => {
      if (post.length === 0) {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      } else {
        db.update(id, { title, contents })
          .then((post) => {
            res.status(200).json({
              post,
              message: "Update successful"
            });
          })
          .catch(() => {
            res.status(500).json({
              message: "The post information could not be modified."
            });
          });
      }
    }).catch((err)=> {
        console.log(err)
    });
  }
});

module.exports = router;
