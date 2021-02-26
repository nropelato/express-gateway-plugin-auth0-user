const axios = require('axios');
const jwtDecode = require('jwt-decode');

module.exports = pluginContext => {
  return {
    name: 'user',
    policy: (actionParams) => {
      return async (req, res, next) => {
        const accessToken = req.headers.authorization
        const userId = getUserId(req.headers)
        const auth0UserUrl = `https://${actionParams.domain}/api/v2/users/${userId}`;

        const data = axios.get(auth0UserUrl, {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `${accessToken}`
					}
				})
        .then(response => {
					resolve(response.data);
				})
				.catch(error => {
					console.warn('Cannot retrieve user data', error);
					reject(error);
				});
        console.log(data);
        if (data !== undefined) {
          req['user'] = JSON.stringify(data);
          return next()
        }

        res.sendStatus(401)
      }
    },
    schema: {
      $id: "http://express-gateway.io/schemas/plugins/auth0-user.json",
      type: 'object',
      properties: {
          domain: {
              type: 'string',
              format: 'url',
              examples: ['https://your-domain.auth0.com'],
          }
      },
      required: ['domain'],
    },
  }
}

getUserId = (headers) => {
  const token = headers['X-Identity'].split('Bearer ')[1];
  const decoded = jwtDecode(token);

  if (!decoded) {
    return null;
  }
  const { sub: userId } = decoded;
  return userId;
};