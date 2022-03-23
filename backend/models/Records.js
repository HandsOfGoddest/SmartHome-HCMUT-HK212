const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecordsSchema = new Schema(
  {
    ID:{
      type: String,
      required: true,
    },
    name:{
      type: String,
    },
    data:{
      type: Number,
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

module.exports = mongoose.model('Records', RecordsSchema);