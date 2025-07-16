const { connectToDatabase } = require("./mongoConnection");

let collections = {};

const initializeCollections = async () => {
  const db = await connectToDatabase();
  collections.termsCollection = db.collection("Terms");
  collections.recordsCollection = db.collection("Records");
  console.log("Collections initialized");
};

module.exports = { initializeCollections, collections };
