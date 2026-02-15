import { matchPassword, onLight } from "../controller/controller1.js";
import express from "express";

const router1 = express.Router();

router1.post("/matchpass", matchPassword);

router1.post("/onlight/:lightno",onLight);

export { router1 };
