const express = require("express");
const connectDB = require("./config/db")
const app = express();

// app.use("/", (req, res) => {
//     console.log("you are here.");
// });

connectDB();

const port = 3000;
app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});
