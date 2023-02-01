import jwt from 'jsonwebtoken';
import userModel from '@/models/user';
import code from '@/shared/code';
import { SECRET_KEY } from '@/shared/index';
import { NextFunction } from 'express';

export default async function authGuard(req: any, res: any, next: NextFunction) {
  try {
    const proxyToken = req.headers['x-access-token'];
    const user = await userModel.findOne({ proxyToken });

    if (!user) {
      return res.json({ status: code.ERROR, message: 'UNAUTHORIZATION' });
    }

    const { token } = user;
    const decoded = <{ id: String }>jwt.verify(token, SECRET_KEY);
    const { id } = decoded;

    if (!id) {
      return res.json({ status: code.ERROR, message: 'INVALID_TOKEN' });
    }

    return next();
  } catch (error) {
    console.log('error', error);
    res.json({ status: code.ERROR, message: 'UNAUTHORIZATION' });
  }
}
