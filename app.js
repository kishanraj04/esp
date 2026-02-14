const express = require("express");

// 39ayk0YzXqsPi8cPxH9nwmFDWPT_23eCzCxk8nptn1LpgUguQ

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.get("/api/data", (req, res) => {
  console.log("ruqueste come");
  res.json({
    message: "Hello from Express server",
    status: true
  });
});

app.post("/api/send", (req, res) => {
  console.log(req.body);

  res.json({
    message: "Data received successfully",
    data: req.body
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
