const Scholarship = require("../models/scholarship");

const getAllScholarships = async (req, res) => {
    try {
        const scholarships = await Scholarship.find();
        res.status(200).json(scholarships);
    } catch (error) {
        console.error("Error fetching scholarships:", error);
        res.status(500).json({ message: error.message });
    }
};

const getScholarshipById = async (req, res) => {
    const { id } = req.params;
    try {
        const scholarship = await Scholarship.findById(id);

        if (!scholarship) {
            return res.status(404).json({ message: "Scholarship not found" });
        }

        res.status(200).json(scholarship);
    } catch (error) {
        console.error("Error fetching scholarship:", error);
        res.status(500).json({ message: error.message });
    }
};

const updateScholarship = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const scholarship = await Scholarship.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!scholarship) {
            return res.status(404).json({ message: "Scholarship not found" });
        }

        res.status(200).json(scholarship);
    } catch (error) {
        console.error("Error updating scholarship:", error);
        res.status(400).json({ message: error.message });
    }
};

const deleteScholarship = async (req, res) => {
    const { id } = req.params;

    try {
        const scholarship = await Scholarship.findByIdAndDelete(id);

        if (!scholarship) {
            return res.status(404).json({ message: "Scholarship not found" });
        }

        res.status(200).json({ message: "Scholarship deleted successfully" });
    } catch (error) {
        console.error("Error deleting scholarship:", error);
        res.status(500).json({ message: error.message });
    }
};

const createScholarship = async (req, res) => {
    try {
        const scholarship = new Scholarship(req.body);
        const savedScholarship = await scholarship.save();
        res.status(201).json(savedScholarship);
    } catch (error) {
        console.error("Error creating scholarship:", error);
        res.status(400).json({ message: error.message });
    }
};


module.exports = {
    getAllScholarships,
    getScholarshipById,
    updateScholarship,
    deleteScholarship,
    createScholarship,
};
