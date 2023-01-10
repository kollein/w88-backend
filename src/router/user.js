
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import userModel from '@/models/user';
import code from '@/shared/code';

export default function userRouter(router) {

  router.post('/register', async (req, res) => {
    console.log(req.body)
    try {
      const newPassword = await bcrypt.hash(req.body.password, 10)
      await userModel.create({
        name: req.body.name,
        email: req.body.email,
        password: newPassword,
        balance: 1000,
      })
      res.json({ status: code.SUCCESS })
    } catch (err) {
      console.log('err', err);
      res.json({ status: code.ERROR, message: err.code })
    }
  })

  router.post('/login', async (req, res) => {
    const user = await userModel.findOne({
      email: req.body.email,
    })

    if (!user) {
      return res.json({ status: code.ERROR, message: 'Unauthorization' });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    )

    if (isPasswordValid) {
      const token = jwt.sign(
        {
          name: user.name,
          email: user.email,
        },
        'secret123'
      )

      return res.json({ status: code.SUCCESS, user: token })
    } else {
      return res.json({ status: code.ERROR, user: false })
    }
  })

  router.get('/quote', async (req, res) => {
    const token = req.headers['x-access-token']

    try {
      const decoded = jwt.verify(token, 'secret123')
      const email = decoded.email
      const user = await userModel.findOne({ email: email })

      console.log('valid token')
      return res.json({ status: code.SUCCESS, quote: user.quote })
    } catch (error) {
      console.log(error)
      res.json({ status: code.ERROR, message: 'invalid token' })
    }
  })

  router.post('/quote', async (req, res) => {
    const token = req.headers['x-access-token']

    try {
      const decoded = jwt.verify(token, 'secret123')
      const email = decoded.email
      await userModel.updateOne(
        { email: email },
        { $set: { quote: req.body.quote } }
      )

      return res.json({ status: code.SUCCESS })
    } catch (error) {
      console.log(error)
      res.json({ status: code.ERROR, message: 'invalid token' })
    }
  })
}
