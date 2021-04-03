const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
const UserModel = require("./User.model");

//init
require("./db");

//Middlewares
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));

//Form page
app.get("/", (req, res) => {
  res.render("index", {
    registered: req.cookies.registered ? true : false,
    errorMsg: "",
  });
});

app.post("/", async (req, res) => {
  const { name, email, phone, business_type, business_name } = req.body;

  if (!name || !email || !phone || !business_type || !business_name) {
    res.cookie("registered", false, { maxAge: 0 });
    return res.render("index", { registered: false });
  }

  //Check if email is registered before
  let userSearch = await UserModel.findOne({ email });
  if (userSearch) {
    res.cookie("registered", false, { maxAge: 0 });
    return res.render("index", {
      registered: false,
      errorMsg: "You have already registered before",
    });
  }

  await UserModel.create({
    name,
    phone,
    email,
    businessType: business_type,
    businessName: business_name,
  });

  res.cookie("registered", true);
  return res.render("index", { registered: true, errorMsg: "" });
});

/*********************************************************/

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
