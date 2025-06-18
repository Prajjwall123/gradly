const express = require("express");
const connectDB = require("./config/db");
const app = express();

const universityRoutes = require("./routes/universityRoutes");
const scholarshipRoutes = require("./routes/scholarshipRoutes");
const courseRoutes = require("./routes/courseRoutes");

connectDB();

app.use(express.json());

app.use("/api/universities", universityRoutes);
app.use("/api/scholarships", scholarshipRoutes);
app.use("/api/courses", courseRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
