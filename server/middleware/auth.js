const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  return next();
};

const requireSecure = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.hostname}${req.url}`);
    }
  }
  return next();
};

module.exports = {
  requireLogin,
  requireSecure,
};
