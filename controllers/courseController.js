const Course = require("../models/course");

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate("university");
        res.status(200).json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: error.message });
    }
};

const getCourseById = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findById(id).populate("university");

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json(course);
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).json({ message: error.message });
    }
};

const updateCourse = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const course = await Course.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        }).populate("university");

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json(course);
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(400).json({ message: error.message });
    }
};

const deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await Course.findByIdAndDelete(id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ message: error.message });
    }
};

const createCourse = async (req, res) => {
    try {
        const course = new Course(req.body);
        const savedCourse = await course.save();
        res.status(201).json(savedCourse);
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(400).json({ message: error.message });
    }
};


module.exports = {
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    createCourse,
};
