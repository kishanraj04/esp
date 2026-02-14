import { matchPassword } from "../controller/controller1.js";
import express from "express";

const router1 = express.Router();

router1.post("/matchpass", matchPassword);

export { router1 };
