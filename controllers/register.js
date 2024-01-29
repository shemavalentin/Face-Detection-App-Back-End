const handleRegister = (req, res, db,bcrypt) => {
	const { email, name, password } = req.body;
	if (!email || !name || !password){
		return res.status(400).json('Incorrect form submition');
	}

		// Creating a transaction to make sure if a user is able to loggin, he also has password in login table to avaoid inconsistances.
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		. returning('email')
		.then(loginEmail => {
			return trx('users')
				.returning('*')
				.insert({
					email: loginEmail[0].email,
					name: name,
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]);
				})
		})
		.then(trx.commit)   // trx.commit to add the changes to the login table
		.catch(trx.rollback) // if fails roll back and throe an error.
	})
	.catch(err => res.status(400).json('Unable to register!'))
}

module.exports = {
	handleRegister: handleRegister

};