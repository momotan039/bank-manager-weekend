const connectToMongoDB = (database) => {
  var MongoClient = require("mongodb").MongoClient;
  const uri =
    "mongodb+srv://momotaha039:0LR7XA7JI7jpBqii@cluster0.0x5nbdj.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  client
    .connect()
    .then((result) => {
      database = result.db("mern_app");
      console.log("Connected succsefully to mongodb server");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports={connectToMongoDB}