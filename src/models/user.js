import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		balance: { type: Number },
		quote: { type: String },
	},
	{ collection: 'user' }
)

const userModel = mongoose.model('user', userSchema)

export default userModel;
