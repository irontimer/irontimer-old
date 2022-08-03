import { Router } from "express";
import { asyncHandler } from "../../middlewares/api-utils";
import * as RateLimit from "../../middlewares/rate-limit";
import * as PsaController from "../controllers/psa";

const router = Router();

router.get("/", RateLimit.psaGet, asyncHandler(PsaController.getPsas));

export default router;
