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
		id: { type: Number, required: true },
		name: { type: String, required: true },
		result: { type: resultSchema, required: true },
		start: { type: Number, required: true },
		end: { type: Number, required: true },
	},
	{ collection: 'keno' }
)

const kenoModel = mongoose.model('keno', kenoSchema)

export default kenoModel;
