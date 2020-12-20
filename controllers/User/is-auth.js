const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User/user');
const Profile = require('../../models/User/profile');

exports.userSignUp = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error('Validation failed.');
		error.statusCode = 422;
		error.data = errors.array();
		console.log(error.data);
		throw error;
	}
    const username = req.body.username;
    const email    = req.body.email;
	const password = req.body.password;
	let hashedPassword = null;
	bcrypt
		.hash(password, 12)
		.then((hashedPw) => {

			hashedPassword = hashedPw;
			const profile = new Profile({
				PersonalDescription: "No Description Added Yet",
				ProfilePhotoSecureId : "https://i.pinimg.com/736x/43/30/da/4330da45e2f3a808092cced2543b35c5.jpg",
				ProfilePhotoPublicId : null
			});
			return profile.save();
		})
		.then(userProfileSaved => {
			const user = new User({
                Username: username,
                Email   : email,
				Password: hashedPassword,
				Profile: userProfileSaved._id
			});
			return user.save();
		})
		.then((result) => {
			res.status(201).json({ message: 'User Account created!', userId: result._id });
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.userLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	let loadedUser;
	User.findOne({ Email: email })
		.then((user) => {
			if (!user) {
				const error = new Error('A user with this name could not be found.');
				error.statusCode = 404;
				throw error;
			}
			loadedUser = user;
			return bcrypt.compare(password, user.Password);
		})
		.then((isEqual) => {
			if (!isEqual) {
				const error = new Error('Wrong password!');
				error.statusCode = 401;
				throw error;
			}
			const token = jwt.sign(
				{
					name: loadedUser.Username,
					userId: loadedUser._id.toString(),
				},
				'Thisisasecret-password-tercesasisihT',
				{ expiresIn: '24h' }
			);
			res.status(200).json({
				token: token,
				username: loadedUser.Username,
				userId: loadedUser._id.toString()
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};
