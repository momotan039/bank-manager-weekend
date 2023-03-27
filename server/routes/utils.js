const isActiveUser = async (user, res) => {
  if (!user.isActive) {
    res.status(400).send({
      msg: "You cannot complete this process,This account is Inactive",
    });
    return false;
  }
  return true;
};

const getUser = async (collection, id) => {
  return await collection.findOne({ _id: id });
};

const isValidUser = async (collection,res,id) => {
  const user = await getUser(collection, id);
  if (!user) {
    res.status(400).send({
      msg: "not found user!!",
    });
    return false;
  }
  const isActiveUserResult = await isActiveUser(user, res);
  if (!isActiveUserResult) return false;
};


module.exports = { isActiveUser, getUser,isValidUser };
