import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidV4 } from 'uuid';
import userModel from '@/models/user';
import code from '@/shared/code';
import { SECRET_KEY } from '@/shared/index';
import authGuard from '@/middlewares/authGuard';

export default function userRouter(router) {

  router.post('/register', async (req, res) => {
    console.log(req.body)
    try {
      const newPassword = await bcrypt.hash(req.body.password, 10)
      await userModel.create({
        username: req.body.username,
        email: req.body.email,
        password: newPassword,
        balance: 1000000000,
      })
      res.json({ status: code.SUCCESS })
    } catch (err) {
      console.log('err', err);
      res.json({ status: code.ERROR, message: err.code })
    }
  })

  router.post('/login', async (req, res) => {
    try {

      const user = await userModel.findOne({
        username: req.body.username,
      })

      if (!user) {
        return res.json({ status: code.ERROR, message: 'Unauthorization' });
      }

      const { id, password } = user;

      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        password
      )

      if (isPasswordValid) {
        const options = { expiresIn: 3600 }
        const token = jwt.sign({ id }, SECRET_KEY, options)
        const proxyToken = uuidV4()
        await userModel.updateOne({ _id: id }, { $set: { token, proxyToken } })

        return res.json({ status: code.SUCCESS, token: proxyToken })
      } else {
        return res.json({ status: code.ERROR, message: 'Invalid password' })
      }
    } catch (err) {
      return res.json({ status: code.ERROR, message: err.message })
    }

  })

  router.get('/iam', authGuard, async (req, res) => {
    try {
      const proxyToken = req.headers['x-access-token']
      const user = await userModel.findOne({ proxyToken })

      if (!user) {
        return res.json({ status: code.ERROR, message: 'UNAUTHORIZATION' });
      }

      const { token, balance, email } = user;
      const decoded = jwt.verify(token, SECRET_KEY)
      const { id } = decoded;

      if (!id) {
        return res.json({ status: code.ERROR, message: 'INVALID_TOKEN' });
      }

      return res.json({ status: code.SUCCESS, user })

    } catch (error) {
      res.json({ status: code.ERROR, message: 'INVALID_TOKEN' })
    }
  })
}
