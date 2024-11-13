// Custom Middleware for User Authentication
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send('Unauthorized. <a href="/">Log in</a>');
    }
};

module.exports = { isAuthenticated };