import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
	// FYI: server/docs/Keno.md
	{
		nums: { type: Array },
		sum: { type: Number },
		bigSmall: { type: String }, // based on sum
		oddEven: { type: String }, // based on sum
		refund: { type: Boolean },
		upDownDraw: { type: String },
		oddsEvensDraw: { type: String }, // based on 10 nums (odd numbers > 10, even numbers > 10, odd numbers = even numbers)
		cross: { type: String }, // xien based on sum (BIG-ODD, BIG-EVEN, SMALL-ODD, SMALL-EVEN)
	}
)

const kenoSchema = new mongoose.Schema(
	{
		gameId: { type: String, required: true },
		name: { type: String, required: true },
		roundId: { type: Number, required: true },
		result: { type: resultSchema, required: true },
		startAt: { type: Number, required: true },
		endAt: { type: Number, required: true },
		status: { type: String, required: true }, // running|ended
	},
	{ collection: 'keno' }
)

kenoSchema.methods.toJSON = function () {
	return {
		id: this._id,
		name: this.name,
		duration: this.duration,
	}
}

const kenoModel = mongoose.model('keno', kenoSchema)

export default kenoModel;
