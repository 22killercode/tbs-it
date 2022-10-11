const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    console.log("entor en el herlper para autenticar", req, res)
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Debe Ingresar al Sistema.');
    res.redirect('/');
};

module.exports = helpers; 