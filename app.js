const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require('path');
const app = express();

const universityRoutes = require("./routes/universityRoutes");
const scholarshipRoutes = require("./routes/scholarshipRoutes");
const courseRoutes = require("./routes/courseRoutes");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const contactRoutes = require('./routes/contactRoutes');
const scholarshipApplicationRoutes = require('./routes/scholarshipApplicationRoutes');
const authRoutes = require('./routes/authRoutes');

connectDB();

const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/images', express.static(path.join(__dirname, 'images')));

app.use("/api/universities", universityRoutes);
app.use("/api/scholarships", scholarshipRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/applications", applicationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/scholarship-applications', scholarshipApplicationRoutes);
app.use('/api/auth', authRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
