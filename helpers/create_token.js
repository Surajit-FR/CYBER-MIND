const { secret_key } = require('./secret_key');
const JWT = require('jsonwebtoken');

const CreateToken = (user) => {
    const token = JWT.sign({
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        profile_img: user.profile_img,
        city_state: user.city_state,
        password: user.password,
        socketId: user.socketId,
        family: user.family,
        type: user.type,
        is_online: user.is_online,
        is_delete: user.is_delete,
    }, secret_key, { expiresIn: '2h' });

    return token;
};

module.exports = CreateToken;