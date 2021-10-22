const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const routeAuth = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require ("path");

dotenv.config();
app.use(express.json());
app.use("/images",express.static(path.join(__dirname,"/images")))
mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
    // useCreateIndex: true,
  })
  .then(console.log("connected to database"))
  .catch((err) => console.log(err));
  const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
      cb(null,"images");
    },
    filename:(req, file, cb)=>{
      cb(null,req.body.name);
    },
  });

  const upload = multer({storage:storage});
  app.post("/api/upload", upload.single("file"), (req,res)=>{
   return res.status(200).json("File has been uploaded");
  })
app.use("/api/auth", routeAuth);
app.use("/api/users", userRoute);
app.use("/api/posts",postRoute);
app.use("/api/categories",categoryRoute);

app.listen("6000", () => {
  console.log("Server is on");
});
