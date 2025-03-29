const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const leaderboardSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
