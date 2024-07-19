import express from "express";
import * as controller from "../controllers/controllers.js";

const router = express.Router();
router.get('/', controller.homePage);
router.get('/createRoom', controller.room)

export default router;
