import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  email: { type: String},
  name: { type: String},
  question: {type: String},
  photo: {type: String, default: ""},
  answers: [{
    fromEmail: {type: String, default: ""},
    name: {type: String, default: ""},
    answer: {type: String, default: ""},
    photo: {type: String, default: ""},
  }],
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Question", QuestionSchema);
