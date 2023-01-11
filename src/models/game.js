import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true },
		duration: { type: Number, required: true } // in second
	},
	{ collection: 'game' }
)

gameSchema.methods.toJSON = function () {
	return {
		id: this._id,
		name: this.name
	}
}

const gameModel = mongoose.model('game', gameSchema)

export default gameModel;
