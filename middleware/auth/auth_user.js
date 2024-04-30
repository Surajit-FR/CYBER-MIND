const JWT = require('jsonwebtoken');
const { secret_key } = require('../../helpers/secret_key');

exports.VerifyToken = async (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers.authorization;
    try {
        if (token?.startsWith('Bearer ')) {
            token = token.slice(7);
        };

        if (!token) {
            return res.status(401).json({ success: false, message: "Token required for authorization", key: "token" });
        };

        const decoded_token = JWT.verify(token, secret_key);
        // Attach the decoded token to the request object
        req.decoded_token = decoded_token;

        next();

    } catch (exc) {
        console.log(exc.message);
        return res.status(500).json({ success: false, messaage: "Internal server error", error: exc.message });
    };
};