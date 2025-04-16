// Only enable MSW for GraphQL-related tests
if (process.env.USE_MSW === "true") {
  const { setupServer } = require("msw/node");
  const { handlers } = require("./handlers");
  module.exports.server = setupServer(...handlers);
} else {
  module.exports.server = null;
}
