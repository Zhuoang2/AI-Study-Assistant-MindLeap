const db = require('../routes/db-config');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    const { UserName, email, password, passwordConfirm } = req.body;
    if (!UserName || !email || !password || !passwordConfirm) {
        return res.json({ status: "error", error: "Please fill in all fields" });
    } else {
        console.log(email)
        db.query('SELECT email FROM users WHERE email = ?', [email], async (err, result) => {
            if (err) {
                console.log(err);
            }
            if (result.length > 0) {
                return res.json({ status: "error", error: "This email is already in use" });
            } else if (password != passwordConfirm) {
                return res.json({ status: "error", error: "Passwords do not match" });
            } else {
                let hashedPassword = await bcrypt.hash(password, 8);
                console.log(hashedPassword);
                db.query('INSERT INTO users SET ?', { name: UserName, email: email, password: hashedPassword }, (error, results) => {
                    if (error) {
                        console.log(error);
                    }
                    console.log({ status : "success", success: "User Registered Successfully"});
                    return res.json({ status : "success", success: "User Registered Successfully"});
                });
            }
        })
    }
}
module.exports = register;