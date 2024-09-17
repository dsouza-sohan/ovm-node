const jwttoken = require("jsonwebtoken");

module.exports = {
  validateToken: (req, res, next) => {
    const authorizationHeaader = req.headers.authorization;
    let result;
    if (authorizationHeaader) {
      const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
      try {
        // verify makes sure that the token hasn't expired and has been issued by us
        result = jwttoken.verify(token, process.env.TOKEN_SECRET);
        console.log(result, process.env.TOKEN_SECRET);
        // return;
        // Let's pass back the decoded token to the request object
        req.decoded = result;
        // We call next to pass execution to the subsequent middleware
        next();
      } catch (err) {
        // Throw an error just in case anything goes wrong with verification
        // throw new Error(err);
        result = {
          message: err,
          code: 401,
          data: null,
        };
        return res.status(401).send(result);
      }
    } else {
      result = {
        message: `Authentication error. Token required.`,
        code: 401,
        data: null,
      };
      return res.status(401).send(result);
    }
  },
};
