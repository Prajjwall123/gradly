const express = require("express");
const router = express.Router();

const {
    getAllUniversities,
    getUniversityById,
    updateUniversity,
    deleteUniversity,
    createUniversity
} = require("../controllers/universityController");

router.get("/", getAllUniversities);
router.post("/", createUniversity);
router.get("/:id", getUniversityById);
router.put("/:id", updateUniversity);
router.delete("/:id", deleteUniversity);

module.exports = router;
