import mongoose from 'mongoose';

const betSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true },
		gameId: { type: String, required: true },
		roundId: { type: Number, required: true },
		betType: { type: Object, required: true }, // {bigSmall: 'big'}
		amount: { type: Number, required: true },
		win: { type: Number, required: true, default: 0 },
		createdAt: { type: Number, required: true },
		status: { type: String, required: true }, // running|ended
	},
	{ collection: 'bet' }
)

betSchema.methods.toJSON = function () {
	return {
		id: this._id,
		userId: this.userId,
		gameId: this.gameId,
		roundId: this.roundId,
		betType: this.betType,
		win: this.win,
		createdAt: this.createdAt,
		status: this.status,
	}
}

const betModel = mongoose.model('bet', betSchema)

export default betModel;
