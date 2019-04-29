module.exports = (app) => {
    const user = require('../controllers/userController.js');
	 const authenticate = require("../middleware/authenticate");

    // Create a new User
    app.post('/user', user.createUser);
	
	// User login
    app.post('/user/login', user.userLogin);

    // Retrieve all User
    app.get('/user', user.getUsersDetails);

    // Retrieve a single User with id
    app.get('/user/:UserId',authenticate, user.findUserByUserId);

    // Update a User with id
    app.put('/user/:UserId',authenticate, user.updateUserByUserId);

    // Delete a User with id
   app.delete('/user/:UserId',authenticate, user.deleteUserDetailsByUserId);
}