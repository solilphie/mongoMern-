const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  author: String,
  jobid: String,
  name: String,
  email: String,
  resume: String,
  coverletter: String,
  published: {
    type: Date,
    default: Date.now,
  },
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
