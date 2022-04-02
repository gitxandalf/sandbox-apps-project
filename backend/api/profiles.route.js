import express from "express"
import ProfilesCtrl from "./profiles.controller.js"

const router = express.Router()

router.route("/").get(ProfilesCtrl.apiGetProfiles)

export default router