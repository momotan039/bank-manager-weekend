const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { isActiveUser, getUser, isValidUser } = require("./utils");

router.get("/depositing/:id/:cash", async (req, res) => {
  let { id, cash } = req.params;
  cash = parseInt(cash);
  const collection = req.database.collection("users");
  //check validation user
  const isValidUserResutl = await isValidUser(
    collection,
    res,
    new ObjectId(id)
  );
  if (!isValidUserResutl) {
    return;
  }

  console.log("uesssssssssss");
  try {
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $inc: { cash } },
      { returnOriginal: false }
    );
    if (result.value) {
      res.send(
        `User with ${result.value.passportId} passport id, deposited ${cash} successfully`
      );
    } else {
      res.send("User not found");
    }
  } catch (err) {
    res.status(400).send({
      msg: err.message,
    });
  }
});

router.put("/update-credit/:id/:credit", async (req, res) => {
  const id = req.params.id;
  const credit = parseInt(req.params.credit);
  const collection = req.database.collection("users");
  //check validation user
  const isValidUserResutl = await isValidUser(
    collection,
    res,
    new ObjectId(id)
  );
  if (!isValidUserResutl) {
    return;
  }
  // validate credit number
  if (isNaN(credit) || credit < 0) {
    res.status(400).send({
      msg: "Sent Invalid Credit Number",
    });
    return;
  }

  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { credit } }
    );
    if (result.modifiedCount === 1) {
      res.send(`Credit of user with ID ${id} updated to ${credit}`);
    } else {
      res.send("User not found");
    }
  } catch (err) {
    res.status(400).send({
      msg: err.message,
    });
  }
});

router.put("/update-activity/:id/:activity", async (req, res) => {
  const { id, activity } = req.params;
  const collection = req.database.collection("users");
  let boolActivity = parseInt(activity);
  if (isNaN(boolActivity)) {
    res.status(400).send({
      msg: "Sent Invalid Activity!!",
    });
    return;
  }
  boolActivity = boolActivity ? true : false;
  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isActive: boolActivity } }
    );
    res.send(`Activity of user with ID ${id} updated to ${boolActivity}`);
  } catch (err) {
    res.status(400).send({
      msg: err.message,
    });
  }
});

router.put("/withdraw/:id/:amount", async (req, res) => {
  const id = req.params.id;
  let amount = parseInt(req.params.amount);
  const collection = req.database.collection("users");
  //check validation user
  const isValidUserResutl = await isValidUser(
    collection,
    res,
    new ObjectId(id)
  );
  if (!isValidUserResutl) {
    return;
  }
  const user = await collection.findOne({
    _id: new ObjectId(id),
  });
  if (!user) {
    res.status(400).send({
      msg: "user not found!!",
    });
    return;
  }
  let { cash, credit } = user;

  // substraction process
  if (cash >= amount) {
    cash -= amount;
  } else {
    amount -= cash;
    cash = 0;
    if (credit >= amount) {
      credit -= amount;
    } else {
      res.status(400).send({
        msg: "Not enough funds!",
      });
      return;
    }
  }

  try {
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { cash: cash, credit: credit } },
      { returnOriginal: false }
    );
    if (result.value) {
      res.send(`Withdrawa of ${amount} from user with ID ${id} successful`);
    }
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
});

module.exports = router;
