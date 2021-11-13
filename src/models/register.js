const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  phone: {
    type: Number,
    required: true,
    minlength: 10,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

registerSchema.methods.generatetoken = async function () {
  try {
    // console.log(this._id);
    const token = jwt.sign(
      { _id: this._id.toString() },
      "hellohowareyouwhatareyoudoingrightnow"
    );
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
  } catch (e) {
    console.log("not registered" + e);
  }
};

registerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Register = mongoose.model("register", registerSchema);

module.exports = Register;
