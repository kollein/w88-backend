import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		balance: { type: Number },
		token: { type: String },
		proxyToken: { type: String },
	},
	{ collection: 'user' }
)

userSchema.methods.toJSON = function () {
	return {
		id: this._id,
		username: this.username,
		email: this.email,
		balance: this.balance,
	}
}

const userModel = mongoose.model('user', userSchema)

export default userModel;
