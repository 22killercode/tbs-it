const helpers = {};
helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Debe Ingresar al Sistema.');
    res.redirect('/');
};

module.exports = helpers; 