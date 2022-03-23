const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const magneticSwitchSchema = new Schema(
  {
    ID:{
      type: String,
      required: true,
    },
    name:{
      type: String,
    },
    status:{
      type: Boolean,
      required: true,
    },
    enabled:{
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MagneticSwitch', magneticSwitchSchema);