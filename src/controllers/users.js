import mongoose from 'mongoose';
import cartsModel from '../dao/models/carts.js';
import usersModel from '../dao/models/users.js';
import CustomError from '../services/errors/CustomError.js';
import EErrors from '../services/errors/enums.js';
import { notFoundUserError } from '../services/errors/info.js';
import response from '../services/res/response.js';

export const changeRole = async (req, res, next) => {
  let uid = req.params.uid;
  if (!mongoose.Types.ObjectId.isValid(uid)) {
    uid = null;
  }
  const user = await usersModel.findById(uid);
  if (!user) {
    const error = new CustomError({
      name: 'No existe el usuario',
      cause: notFoundUserError(),
      message: 'No existe el usuario con ese id',
      code: EErrors.NOT_FOUND
    });
    next(error);
  } else {
    if (user.role === 'user') {
      user.role = 'premium';
    } else if (user.role === 'premium') {
      user.role = 'user';
    }
    await user.save();
    response(res, 200, user.role);
  }
};

export const deleteUser = async (req, res, next) => {
  let uid = req.params.uid;
  if (!mongoose.Types.ObjectId.isValid(uid)) {
    uid = null;
  }
  const user = await usersModel.findById(uid);
  if (!user) {
    const error = new CustomError({
      name: 'No existe el usuario',
      cause: notFoundUserError(),
      message: 'No existe el usuario con ese id',
      code: EErrors.NOT_FOUND
    });
    next(error);
  } else {
    const cid = user.cart;
    try {
      await cartsModel.findByIdAndDelete(cid);
      await usersModel.findByIdAndDelete(uid);
      response(res, 200, 'Usuario eliminado');
    } catch (error) {
      return { error: error.message };
    }
  }
};
