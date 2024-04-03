const express = require("express");
const authRouter = express.Router();
const { UserModel } = require("../Model/user.model");

const bcrypt = require("bcrypt");
require("dotenv").config();
const { validator } = require("../Middleware/validator");
const jwt = require("jsonwebtoken");
const { validatorMiddleware } = require("../Middleware/validator");

/**
 *
 */
authRouter.get("/auth", (req, res) => {
  res.send("hello world");
});

authRouter.post("/auth/login", async (req, res) => {
  try {
    let data = req.body;
    let user = await UserModel.find({ email: data.email });
    if (!user.length) {
      return res.status(400).json({ msg: "User not found" });
    }
    // res.send({ a: data, b: user });

    let result = bcrypt.compareSync(data.password, user[0].password);
    if (result) {
      const token = jwt.sign(
        { email: data.email, password: data.password },
        `${process.env.KEY}`
      );

      return res
        .status(201)
        .cookie("authToken", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          domain: "localhost",
        })
        .json({ msg: "Login succcessfull" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal server error", error: err.message });
  }
});

/**
 *
 *                    ========  ..signup
 */
authRouter.post("/auth/signup", async (req, res) => {
  try {
    let data = req.body;
    let isExist = await UserModel.find({ email: data.email });
    console.log(isExist);
    if (isExist.length) {
      return res.status(200).json({ msg: "Signup failed" });
    }

    bcrypt.hash(data.password, 5).then(async function (hash) {
      // Store hash in your password DB.

      console.log(hash, "hashed password");
      if (hash) {
        let newUser = new UserModel({
          ...data,
          email: data.email,
          password: hash,
        });
        await newUser.save();
        console.log(newUser);
        const token = jwt.sign(
          { email: newUser.email, password: newUser.password },
          `${process.env.KEY}`
        );
        res.cookie("authToken", token, {
          httpOnly: true,
        });

        return res.status(201).json({ msg: "Registration succcessfull" });
      }
      //
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal server error", error: err.message });
  }
});

authRouter.post("/auth/addNew", async (req, res) => {
  try {
    let data = req.body;
    let isExist = await UserModel.find({ email: data.email });
    console.log(isExist);
    if (isExist.length) {
      return res.status(200).json({ msg: "User already exists" });
    }

    let newUsers = new UserModel(data);
    await newUsers.save();
    let allusers = await UserModel.find();
    res.send(allusers);
  } catch (err) {
    res.status(500).json({ msg: "Internal server error", error: err.message });
  }
});

authRouter.get("/auth/allUsers", async (req, res) => {
  try {
    let allUser = await UserModel.find();

    return res.status(200).json({ msg: "all Users", data: allUser });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Internal server error", error: err.message });
  }
});

authRouter.delete("/auth/delete/:id", async (req, res) => {
  try {
    let { id } = req.params;

    await UserModel.deleteOne({ _id: id });
    let allUser = await UserModel.find();
    res.json({ msg: "delete success", data: allUser });
  } catch (err) {
    return res.status(500).json({
      msg: "User not found / Internal server Error",
      error: err.message,
    });
  }
});

authRouter.patch("/auth/edit/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let user = await UserModel.updateOne({ _id: id }, req.body);
    let allUser = await UserModel.find();
    return res.status(200).json({ msg: "User updated", data: allUser });
  } catch (err) {
    res.status(500).json({
      msg: "user not found/internal server error",
      error: err.message,
    });
  }
});

module.exports = { authRouter };
