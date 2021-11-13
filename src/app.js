const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 8000;

require("./db/conn");
const Register = require("../src/models/register");
const { urlencoded } = require("express");

const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialsPath);
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const registerStd = new Register({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      gender: req.body.gender,
      phone: req.body.phone,
      age: req.body.age,
      password: req.body.password,
    });

    console.log(registerStd);

    const genToken = await registerStd.generatetoken();
    // console.log(genToken);

    const registerData = await registerStd.save();
    res.status(201).render("regsuc");
  } catch (e) {
    res.status(400).send("not successful" + e);
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const emailData = await Register.findOne({ email });
    const isMatch = await bcrypt.compare(password, emailData.password);
    const genToken = await emailData.generatetoken();
    console.log(genToken);
    if (isMatch) {
      res.status(200).render("logsuc");
    } else {
      res.status(400).send("invalid password.");
    }
  } catch (e) {
    res.send(e);
  }
});

app.get("/help", (req, res) => {
  res.render("help");
});

// const securePassword = async (pass) => {
//   const hashPassword = await bcrypt.hash(pass, 10);
//   console.log(hashPassword);

//   const matchPassword = await bcrypt.compare("ywr", hashPassword);
//   console.log(matchPassword);
// };

// securePassword("ywr");

// const createToken = async () => {
//   const token = await jwt.sign(
//     { _id: "618e60dcdc87e58b072b4ac1" },
//     "pathanyawarkhanyasinkhanhowareyou",
//     { expiresIn: "2 seconds" }
//   );
//   console.log(token);
//   const verifyToken = await jwt.verify(
//     token,
//     "pathanyawarkhanyasinkhanhowareyou"
//   );
//   console.log(verifyToken);
// };
// createToken();

app.listen(port, () => {
  console.log(`listening to port no. ${port}`);
});
