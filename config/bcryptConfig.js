const bcrypt = require('bcryptjs');

const encryptPassword = async(password) => {
    return new Promise((resolve, reject) => {
        // hash is used to convert the password into encrytped form and 10 is the level of complexity of the password
        bcrypt.hash(password, 10, (err, hash) => {
            if (err)
                reject(err)
            resolve(hash)

        })
    })
}
module.exports = { encryptPassword }