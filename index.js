const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
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
    return res.render("index", { registered: false, errorMsg: "" });
  }

  //Check if email is registered before
  let userSearch = await UserModel.findOne({ email });
  if (userSearch) {
    res.cookie("registered", true);
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

  const transporter = nodemailer.createTransport({
    service: "gmail",
    server: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "archaos.word@gmail.com",
    to: email,
    subject: "Testing for techne-drifts",
    text: "This is a test email",
  };

  // transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Email sent: " + info.response);
  //   }
  // });

  res.cookie("registered", true);
  return res.render("index", { registered: false, errorMsg: "" });
});

/*********************************************************/

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
