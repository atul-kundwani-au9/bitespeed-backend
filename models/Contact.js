const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  phoneNumber: { type: String, required: false },
  email: { type: String, required: false },
  linkedId: { type: Schema.Types.ObjectId, ref: 'Contact', default: null },
  linkPrecedence: { type: String, enum: ['primary', 'secondary'], required: true, default: 'primary' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});

module.exports = mongoose.model('Contact', contactSchema);
