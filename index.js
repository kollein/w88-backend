import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import initRouter from '@/router/index';
import bodyParser from '@/middlewares/bodyParser';
// eslint-disable-next-line no-unused-vars
import runHeartBeat from '@/scheduler/index';

// timezone
// eslint-disable-next-line no-undef
process.env.TZ = 'Asia/Bangkok';
console.log(new Date().toString());

const app = express()
const router = express.Router()
app.use(cors())
app.use(express.json())
app.use(bodyParser)

mongoose.set('strictQuery', false)
mongoose
	.connect('mongodb://localhost:27017/test')
	.then(() => console.log('Connected!'));

// initialize all routes
initRouter(router);
// add router prefix
app.use('/api', router);

// run the heart beat to perform the process in every second
// runHeartBeat();

const PORT = 6000;
app.listen(PORT, () => {
	console.log(`Server started on ${PORT}`)
})
