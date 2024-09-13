//auth middleware
exports.userauth = (req, res, next) => {
  if (req.session.userinfo && req.session.userrole === 0) {
    return next();
  } else {
    res.send("Not Allowed");
  }
};

exports.adminauth = (req, res, next) => {
  if (req.session.userinfo && req.session.userrole === 1) {
    return next();
  } else {
    res.send("Not Allowed");
  }
};
