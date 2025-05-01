const mongoose = require("mongoose");
const { MONGODB_URL } = require("../config");

// Connect to MongoDB
mongoose.connect(MONGODB_URL);
// Defined schemas
const UserSchema = new mongoose.Schema({
  name: {
    type:String,
    required: true,

  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bio: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
});

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});
const studyGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const messageSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudyGroup",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const scheduleSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudyGroup",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  deadline: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const noteSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudyGroup",
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isCollaborative: {
    type: Boolean,
    default: false,
  },
  editors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  groupId: { type: String, required: true },  // Ensure this field matches your use case
  title: {type: String, required: true},
  size: { type: Number, required: true },
  timestamp: {type: Date, default: Date.now},
});

const inviteSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: "StudyGroup", required: true },
  inviter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expiresAt: { type: Date, required: true },
});

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
});

const quizSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudyGroup",
    required: true,
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  questions: [questionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  selectedOption: {
    type: String,
    required: true,
  },
});

const quizAttemptSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  answers: [answerSchema],
  score: {
    type: Number,
    required: true,
  },
  attemptedAt: {
    type: Date,
    default: Date.now,
  },
});


const User = mongoose.model("User", UserSchema);
const Role = mongoose.model("Role", roleSchema);
const StudyGroup = mongoose.model("StudyGroup", studyGroupSchema);
const Message = mongoose.model("Message", messageSchema);
const Schedule = mongoose.model("Schedule", scheduleSchema);
const Note = mongoose.model("Note", noteSchema);
const File = mongoose.model("File", fileSchema);
const Invite = mongoose.model("Invite", inviteSchema);
const Quiz = mongoose.model("Quiz", quizSchema);
const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);

module.exports = {
  Role,
  User,
  StudyGroup,
  Message,
  Schedule,
  Note,
  File,
  Invite,
  Quiz,
  QuizAttempt
};
