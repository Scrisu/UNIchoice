// Custom Middleware for User Authentication
const isAuthenticated = (req, res, next) => {
    console.log('Session Data:', req.session);
    if (req.session.user) {
        next();
    } else {
        console.log('Unauthorized Access Attempt Detected');
        res.status(401).send('Unauthorized. <a href="/">Log in</a>');
    }
};
module.exports = { isAuthenticated };