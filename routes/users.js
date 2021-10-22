const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Post = require("../models/Post");
//update
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
     return res.status(200).json(updateUser);
    } catch (err) {
     return res.status(500).json(err);
    }
  } else {
   return res.status(401).json("you can only update your account");
  }
});

//delete

router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);

      try {
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(req.params.id);
       return res.status(200).json("User is deleted...");
      } catch (err) {
       return res.status(500).json(err);
      }
    } catch (err) {
     return  res.status(404).json("User not found!");
    }
  } else {
   return  res.status(401).json("you can only delete your account");
  }
});

//get

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
   return res.status(200).json(others);
  } catch (err) {
   return  res.status(500).json(err);
  }
});

module.exports = router;
