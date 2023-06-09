const User = require("../../models/user.model");
const { deleteFile } = require("../../utils/fileHandling");
const { setError, SetErrorResponse } = require("../../utils/responseSetter");
const { getFuzzySearchPaginatedData } = require("../utils/pagination");

exports.getUser = async (req, res) => {
  try {
    const id = req.params?.userId;
    const user = await User.findOne({ _id: id });
    if (!user) {
      throw new SetErrorResponse("User not found"); // default (Not found,404)
    }
    return res.success({ user });
  } catch (err) {
    return res.fail(err);
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const id = res.locals.authData?._id;
    const user = await User.findOne({ _id: id });

    if (!user) {
      throw new SetErrorResponse("Not found"); // default (Not found,404)
    }
    return res.success({ user });
  } catch (err) {
    return res.fail(err);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { page, limit, search = "", sort } = req.query;
    // const user=await User.find({})
    const user = await getFuzzySearchPaginatedData(
      User,
      {
        sort,
        page,
        limit,
        pagination: true,
        modFunction: (document) => {
          return document;
        },
      },
      search
    );

    if (!user) {
      throw new SetErrorResponse("Users not found"); // default (Not found,404)
    }
    return res.success(user);
  } catch (err) {
    return res.fail(err);
  }
};

exports.patchUserImage = async (req, res) => {
  try {
    const userId = res.locals.authData?._id;
    const coverImage =
      req.files?.coverImage?.length > 0
        ? req.files.coverImage[0]?.location
        : undefined;
    const editQuery = {};

    if (coverImage) {
      editQuery.image = coverImage;
    }
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        ...editQuery,
      }
    );

    if (coverImage && user?.image) {
      deleteFile(user?.image);
    }
    
    if (!user) {
      throw new SetErrorResponse("User not found"); // default (Not found,404)
    }
    return res.success( "User Updated ");
  } catch (err) {
    return res.fail(err);
  }
};
exports.patchUser = async (req, res) => {
  try {
    const userId = res.locals?.authData?._id;
    const { firstName, lastName, address, phoneNumber } = req.body;
    const name = firstName + " " + lastName;

    // const coverImage =
    //   req.files?.coverImage?.length > 0
    //     ? req.files.coverImage[0]?.location
    //     : undefined;

    // if (coverImage) {
    //   editQuery.image = coverImage;
    // }

    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        firstName,
        lastName,
        name,
        address,
        phoneNumber,
      },{new:true}
    );

    // if (coverImage) {
    //   deleteFile(user?.image);
    // }

    if (!user) {
      throw new SetErrorResponse("User not found"); // default (Not found,404)
    }
    return res.success(user, "User Updated ");
  } catch (err) {
    return res.fail(err);
  }
};

