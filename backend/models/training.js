const mongoose = require('mongoose');
const slugify = require('slugify');

const trainingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: String,
    location: String,
    date: Date,
    category: String,
    cost: Number,
    requirements: String,
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    appliedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    approved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug; if conflict, append short random string
trainingSchema.pre('save', async function (next) {
  if (!this.isModified('title')) return next();

  const baseSlug = slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 0;

  // loop to avoid collisions
  while (true) {
    const existing = await mongoose.models.Training.findOne({ slug });
    if (!existing || existing._id.equals(this._id)) break;
    count += 1;
    slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`; // short random suffix
    if (count > 5) break; // defensive
  }

  this.slug = slug;
  next();
});

module.exports = mongoose.model('Training', trainingSchema);
