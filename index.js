import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import initRouter from '@/router/index';
import bodyParser from '@/helpers/bodyParser';

const app = express()
const router = express.Router()
app.use(cors())
app.use(bodyParser)
app.use(express.json())

mongoose.set('strictQuery', false)
mongoose
	.connect('mongodb://localhost:27017/test')
	.then(() => console.log('Connected!'));

initRouter(router);
app.use('/api', router);

const PORT = 6000;
app.listen(PORT, () => {
	console.log(`Server started on ${PORT}`)
})
