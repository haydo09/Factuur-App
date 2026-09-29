const Datastore = require('nedb');
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'data');

const klanten = new Datastore({ filename: path.join(dbPath, 'klanten.db'), autoload: true });
const facturen = new Datastore({ filename: path.join(dbPath, 'facturen.db'), autoload: true });
const instellingen = new Datastore({ filename: path.join(dbPath, 'instellingen.db'), autoload: true });
const meta = new Datastore({ filename: path.join(dbPath, 'meta.db'), autoload: true });

// Ensure indexes
klanten.ensureIndex({ fieldName: 'bedrijfsnaam' });
facturen.ensureIndex({ fieldName: 'nummer', unique: true });
facturen.ensureIndex({ fieldName: 'datum' });
instellingen.ensureIndex({ fieldName: 'id', unique: true });
meta.ensureIndex({ fieldName: 'key', unique: true });

// Initialize default meta
meta.findOne({ key: 'lastInvoiceSeq' }, (err, doc) => {
  if (!doc) {
    meta.insert({ key: 'lastInvoiceSeq', value: 0 });
  }
});

module.exports = {
  klanten,
  facturen,
  instellingen,
  meta
};
