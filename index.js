import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import initRouter from '@/router/index';
import bodyParser from '@/helpers/bodyParser';
import runHeartBeat from '@/scheduler/index';

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
// add prefix
app.use('/api', router);

// heart beat
runHeartBeat();

const PORT = 6000;
app.listen(PORT, () => {
	console.log(`Server started on ${PORT}`)
})
