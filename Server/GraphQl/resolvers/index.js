const patientResolvers = require("./patientResolvers");
const testReportResolvers = require("./testReportResolvers");
const cofigReportTempResolver = require("./cofigReportTempResolver");
const superadminResolver = require("./superadminResolver");

module.exports = {
  Query: {
    ...patientResolvers.Query,
    ...testReportResolvers.Query,
    ...cofigReportTempResolver.Query,
    ...superadminResolver.Query,
  },
  Mutation: {
    ...patientResolvers.Mutation,
    ...testReportResolvers.Mutation,
    ...cofigReportTempResolver.Mutation,
    ...superadminResolver.Mutation,
  },
};
