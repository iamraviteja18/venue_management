const httpStatus = require("http-status");

const UserService = require("../services/user.service");

const GetUserById = async (req, res) => {
  try {
    const user = await UserService.GetUserById(req.params.id);
    const { name, role, _id } = user;
    res.status(httpStatus.OK).send({ name, role, _id });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
};

module.exports = {
  GetUserById,
};
