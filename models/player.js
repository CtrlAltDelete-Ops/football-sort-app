const mongoose = require("mongoose");
const validator = require("validator");

const playerSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			validate: {
				validator: (value) => {
					if (!validator.isAlpha(value.replace(/\s+/g, ""))) {
						throw new Error("Player name must contain only letters and spaces");
					}
				},
				message: "Invalid player name",
			},
			minlength: 2,
			maxlength: 50,
			trim: true,
		},
		shooting: {
			type: Number,
			min: 1,
			max: 5,
			required: true,
		},
		passing: {
			type: Number,
			min: 1,
			max: 5,
			required: true,
		},
		dribbling: {
			type: Number,
			min: 1,
			max: 5,
			required: true,
		},
		defending: {
			type: Number,
			min: 1,
			max: 5,
			required: true,
		},
		attacking: {
			type: Number,
			min: 1,
			max: 5,
			required: true,
		},
		leadership: Boolean,
		team: [
			{
				team: {
					type: String,
				},
			},
		],
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);

const Player = mongoose.model("Player", playerSchema);
module.exports = Player;
