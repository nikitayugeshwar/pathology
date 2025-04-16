const { mergeTypeDefs } = require("@graphql-tools/merge");

const patientTypeDefs = require("./patientSchema");
const testReportTypeDefs = require("./testReportSchema");
const configReportTempReportTypeDefs = require("./configReportTemplate");
const superAdmin = require("./superAdmin");

// Merge all typeDefs
const typeDefs = mergeTypeDefs([
  patientTypeDefs,
  testReportTypeDefs,
  configReportTempReportTypeDefs,
  superAdmin,
]);

module.exports = typeDefs;
