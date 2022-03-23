const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    owner: { type: String, required: true },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    gasDevices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GasSensor",
      }
    ],
    lightDevices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LightBulb",
      }
    ],
    switchDevices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MagneticSwitch",
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Room', roomSchema);