const mongoose = require("mongoose");
const app = require("./app");
const path = require(" ");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(
      "mongodb://localhost:27017/chungtaydayluidichbenh",
      {
        useNewUrlParser: true, // <-- no longer necessary
        useUnifiedTopology: true, // <-- no longer necessary
      }
    );
    console.log("connect mongodb success");
  } catch (error) {
    console.log(error.message);
  }
};
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res, next) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

connectDB();
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`connect port ${PORT}`);
});
