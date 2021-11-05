const mongoose = require("mongoose");
const app = require("./app");

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
connectDB();
app.listen(5000, () => {
  console.log("connect port 5000");
});
