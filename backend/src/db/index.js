const mongoose = require('mongoose')
const { MONGODB_URL } = require('../config')

// Connect to MongoDB
mongoose.connect(MONGODB_URL)
// Defined schemas
const UserSchema = new mongoose.Schema({
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
    ref: 'Role',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
})

const User = mongoose.model('User', UserSchema)
const Role = mongoose.model('Role', roleSchema)

module.exports = {
  Role,
  User,
}
