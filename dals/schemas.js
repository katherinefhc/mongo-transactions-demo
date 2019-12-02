const { Schema } = require('mongoose');
const opts = { timestamps: true };

/******************************************************************/
const coffeSchema = new Schema({
  name: String,
  size: String,
  pumpsOfSyrup: Number,
  isEspresso: Boolean,
}, opts);

const Coffee = {
  collection: 'coffee',
  schema: coffeSchema,
};

/******************************************************************/
const carrotsSchema = new Schema({
  label: String,
  weight: Schema.Types.Mixed,
  starRating: Number,
}, opts);

const Carrots = {
  collection: 'carrots',
  schema: carrotsSchema,
};

/******************************************************************/

module.exports = {
  Coffee,
  Carrots,
};
