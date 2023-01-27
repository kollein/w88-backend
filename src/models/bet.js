import mongoose from 'mongoose';

const betSchema = new mongoose.Schema(
	{
		gameId: { type: String, required: true },
		roundId: { type: Number, required: true },
		betType: { type: Object, required: true }, // {bigSmall: 'big', amount: 2}
		createdAt: { type: Number, required: true },
	},
	{ collection: 'bet' }
)

betSchema.methods.toJSON = function () {
	return {
		id: this._id,
		gameId: this.gameId,
		roundId: this.roundId,
		betType: this.betType,
		createdAt: this.createdAt,
	}
}

const betModel = mongoose.model('bet', betSchema)

export default betModel;
