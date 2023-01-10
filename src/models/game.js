import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
	},
	{ collection: 'game' }
)

const gameModel = mongoose.model('game', gameSchema)

export default gameModel;
