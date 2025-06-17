const mongoose = require('mongoose');

const UniversitySchema = new mongoose.Schema({
    university_number: { type: mongoose.Schema.Types.ObjectId, ref: "University", unique: true },
    university_name: String,
    city: String,
    country: String,
    address: String,
    about_us: String,
    location: String,
    average_cost: Number,
    average_duration: String,
    average_cost_of_living: Number,
    average_gross_tuition: Number,
    founded: Number,
    institution_type: { type: String, enum: ['private', 'public'] },
    university_photo: String,
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    scholarships: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship' }]
});

module.exports = mongoose.model('University', UniversitySchema);
