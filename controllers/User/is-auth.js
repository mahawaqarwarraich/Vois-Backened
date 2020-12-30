const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User/user');
const Profile = require('../../models/User/profile');


/**
 * controller function which registers a new user.
 * Before any proceeding, it checks the validity of the 
 * fields sent via the body of the request. And if there's
 * any validation error, it sends back the error with the error
 * information to the client.
 * The data sent via the body contains password of the user
 * and this function makes sure that the password is not stored
 * directly in plain form in the db because it can be very risky
 * so the bcrypt hashing is used to encode the password and store
 * it in the hashed form.
 * Moreover, at the time of creation of the new account, the user profile
 * is also created.
 */
exports.userSignUp = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error('Validation failed.');
		error.statusCode = 422;
		error.data = errors.array();
		console.log(error.data);
		throw error;
	}
	// storing data sent via the body if there's not validation errors
    const username = req.body.username;
    const email    = req.body.email;
	const password = req.body.password;
	let hashedPassword = null;
	bcrypt
		.hash(password, 12)
		.then((hashedPw) => { // function to hash the user password

			hashedPassword = hashedPw;
			const profile = new Profile({ // creating new user profile for the new user with default image as profile dp
				PersonalDescription: "No Description Added Yet",
				ProfilePhotoSecureId : "https://i.pinimg.com/736x/43/30/da/4330da45e2f3a808092cced2543b35c5.jpg",
				ProfilePhotoPublicId : null
			});
			return profile.save();
		})
		.then(userProfileSaved => {
			const user = new User({ // creating new user 
                Username: username,
                Email   : email,
				Password: hashedPassword,
				Profile: userProfileSaved._id
			});
			return user.save(); //saving the new user in the database
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


/**
 * controller function to login a user. 
 * This takes email and password in body 
 * and checks whether a user with the provided email exists.
 * Then it makes use of bcrypt again to match the password entered
 * and if the passwords are equal then the main step comes which is
 * to create a jwt token and the userid and username is stored in 
 * it and the expiry is set for 24 hours. The token created is 
 * sent as a json response to the client side.
 */
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
			return bcrypt.compare(password, user.Password); // comparing passwords
		})
		.then((isEqual) => {
			if (!isEqual) {
				const error = new Error('Wrong password!');
				error.statusCode = 401;
				throw error;
			}
			const token = jwt.sign( // creating a jwt signed token
				{
					name: loadedUser.Username,
					userId: loadedUser._id.toString(),
				},
				'Thisisasecret-password-tercesasisihT',
				{ expiresIn: '24h' }
			);
			res.status(200).json({ //sending back json repsonse
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
