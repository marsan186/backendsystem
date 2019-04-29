module.exports = (app) => {
    const admin = require('../controllers/adminController.js');
    const authenticate = require("../middleware/authenticate");

    // Create a new admin
    app.post('/admin/register', admin.createAdmin);

    // Admin login
    app.post('/admin/login', admin.adminLogin);

    // Retrieve all admin
    app.get('/admin/list', admin.getAdminDetails);

    // Retrieve a single admin with id
    app.get('/admin/list/:admin_id',authenticate, admin.findAdminByAdminId);

    // Update a Admin with id
    app.put('/admin/:admin_id',authenticate, admin.updateAdminByAdminId);

    // Delete a Admin with id
    app.delete('/admin/:admin_id',authenticate, admin.deleteAdminDetailsByAdminId);
}