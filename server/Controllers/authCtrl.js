const bcrypt = require('bcryptjs');
module.exports = {
  register: async (req, res) => {
    // Bring in db 
    const db = req.app.get('db');

    // Receive the information to eventually add a new user

    const { name, email, password, admin } = req.body;

    // Check if user registered already using email, if so, reject

    try {
      const [existingUser] = await db.get_user_by_email(email);

      if (existingUser) {
        return res.status(409).send('User already exists')
      }

      // Hash and salt the password
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      // Add the user to the db and get back their id
      const [newUser] = await db.register_user(name, email, hash, admin)

      // Create a session for the user usign the database response
      req.session.user = newUser;

      // Send a response to the frontend that includes the user session information
      res.status(200).send(newUser)

    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    };

  },
  login: (req, res) => {
    // get db instance
    const db = req.app('db');
    // get necessary info rom req.body
    const { email, password } = req.body;
    // check if that user exists, if they do NOT, reject the request
    db.get_user_by_email(email)
      .then(([existingUser]) => {
        if (!existingUser) {
          return res.status(403).send('Email does not exist')
        } else {
          // check the password from req.body with the stored hash that we just retrieved..if mismatch, reject
          const isAuthenticated = bcrypt.compareSync(password, existingUser.hash)
          if (!isAuthenticated) {
            return res.status(403).send('Incorrect Password.')
          } else if (isAuthenticated) {
            // set up our session and be sure to not include the hash in the session
            delete existingUser.hash;
            req.session.user = existingUser;
            // send the response and session to the front
            res.status(200).send(existingUser)
          }
        }
      })
  },
  logout: (req, res) => {
    // destroys the session associated with the id on the cookie
    req.session.destroy();
    res.sendStatus(200);
  }
}
