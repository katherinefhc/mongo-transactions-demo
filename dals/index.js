const Mongoose = require('mongoose');
const Schemas = require('./schemas');


module.exports = {
  /******************************************************************/
  connectAndInit: async function(opts) {

    const { mongoUrl, mongoOptions } = opts;
    this.db = await Mongoose.createConnection(mongoUrl, mongoOptions);

    await Promise.all(Object.keys(Schemas).map((prop) => {
      const { collection, schema } = Schemas[prop];
      this[collection] = this.db.model(collection, schema);
      return this[collection].createCollection();
    }));
  },

  /******************************************************************/
  closeConnection: async function() {
    if (!this.db) return;
    await this.db.close();
  },

  /******************************************************************/
  dropCollections: async function() {
    if (!this.db) return;

    return Promise.all(Object.keys(Schemas).map((prop) => {
      const { collection } = Schemas[prop];
      return this[collection].deleteMany();
    }));
  },
};
