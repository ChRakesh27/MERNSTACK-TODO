const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema(
  {
    _id: { type: mongoose.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    link: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    position: { type: Number, require: true },
  },
  {
    versionKey: false,
  },
);

const todo = mongoose.model("todo", todoSchema);

module.exports = todo;
