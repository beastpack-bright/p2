const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/');
    return;
  }

  return next();
};
const requireSecure = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      res.redirect(`https://${req.hostname}${req.url}`);
      return;
    }
  }

  return next();
};

module.exports = {
  requireLogin,
  requireSecure,
};
