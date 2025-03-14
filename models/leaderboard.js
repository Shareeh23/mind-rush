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
  },
  { timestamps: true }
);

exports.module = mongoose.model('Leaderboard', leaderboardSchema);
