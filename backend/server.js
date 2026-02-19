const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Add this here
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/dataRollover")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Smart Data Rollover Backend Running");
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
