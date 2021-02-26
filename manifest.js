module.exports = {
  version: '1.0.0',
  init: function (pluginContext) {
    pluginContext.registerPolicy(require('./policies/user-policy.js'));
  },
  policies:['user'],
  schema: {
    $id: "http://express-gateway.io/schemas/plugins/auth0-user.json"
  }
};
