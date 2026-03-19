const express = require("express");
const router = express.Router();

const { register, login, getUsers,
    getUser,
    updateUser,
    deleteUser } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

router.get("/get-users", getUsers);
router.get("/get-user/:id", getUser);
router.put("/update-user/:id", updateUser);
router.delete("/delete-user/:id", deleteUser);

module.exports = router;