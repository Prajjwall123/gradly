const University = require("../models/university");

const getAllUniversities = async (req, res) => {
    try {
        const universities = await University.find()
            .populate("courses")
            .populate("scholarships");
        res.status(200).json(universities);
    } catch (error) {
        console.error("Error fetching universities:", error);
        res.status(500).json({ message: error.message });
    }
};

const getUniversityById = async (req, res) => {
    const { id } = req.params;
    try {
        const university = await University.findById(id)
            .populate("courses")
            .populate("scholarships");

        if (!university) {
            return res.status(404).json({ message: "University not found" });
        }

        res.status(200).json(university);
    } catch (error) {
        console.error("Error fetching university:", error);
        res.status(500).json({ message: error.message });
    }
};

const updateUniversity = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const university = await University.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        })
            .populate("courses")
            .populate("scholarships");

        if (!university) {
            return res.status(404).json({ message: "University not found" });
        }

        res.status(200).json(university);
    } catch (error) {
        console.error("Error updating university:", error);
        res.status(400).json({ message: error.message });
    }
};

const deleteUniversity = async (req, res) => {
    const { id } = req.params;

    try {
        const university = await University.findByIdAndDelete(id);

        if (!university) {
            return res.status(404).json({ message: "University not found" });
        }

        res.status(200).json({ message: "University deleted successfully" });
    } catch (error) {
        console.error("Error deleting university:", error);
        res.status(500).json({ message: error.message });
    }
};

const createUniversity = async (req, res) => {
    try {
        const university = new University(req.body);
        const savedUniversity = await university.save();
        res.status(201).json(savedUniversity);
    } catch (error) {
        console.error("Error creating university:", error);
        res.status(400).json({ message: error.message });
    }
};


module.exports = {
    getAllUniversities,
    getUniversityById,
    updateUniversity,
    deleteUniversity,
    createUniversity
};
