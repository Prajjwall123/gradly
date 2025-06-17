const mongoose = require('mongoose');

const ScholarshipSchema = new mongoose.Schema({
    scholarship_number: { type: mongoose.Schema.Types.ObjectId, ref: "Scholarship", unique: true },
    scholarship_name: String,
    institute: String,
    amount_per_year: Number,
    terms_and_conditions: String
});

module.exports = mongoose.model('Scholarship', ScholarshipSchema);
