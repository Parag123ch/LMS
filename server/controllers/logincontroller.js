const db = require("../../database.js", { root: "." });
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//logincheck hashing
exports.loginsubmit = (req, res, next) => {
  console.log("Login Attempted");
  console.log(req.body);
  const { username, pass } = req.body;
  db.query(
    "SELECT * FROM users WHERE username=" + db.escape(username),
    (err, rows) => {
      if (!err) {
        if (rows[0] === undefined) {
          res.send("User doesn't exist");
        } else {
          const verified = bcrypt.compareSync(pass, rows[0]["pass"]);
          if (verified) {
            console.log("login successfull");
            req.session.userinfo = rows[0].username; //session
            req.session.userrole = rows[0].role;
            req.data = rows[0].role;
            return next();
          } else {
            res.send("Incorrect Enrollment number or password");
          }
        }
      } else {
        console.log(err);
      }
    }
  );
};

//login
exports.login = (req, res, next) => {
  console.log("User Detected");
  if (req.session.userinfo) {
    req.data = req.session.userrole;
    return next();
  } else {
    return res.sendFile("/views/screens/index.html", { root: "." });
  }
};

//signup
exports.signup = (req, res) => {
  console.log("signup detect");
  res.sendFile("/views/screens/sign-up.html", { root: "." });
};
//basic signup entry
exports.signupentry = (req, res) => {
  console.log("sign-up nearabout finished");
  console.log(req.body);
  const { username, email, pass, pass_repeat } = req.body;
  //confirming both password are same
  if (pass === pass_repeat) {
    //Implementing hashing and storing data
    bcrypt.hash(pass, 10, (err, hash) => {
      if (!err) {
        db.query(
          "SELECT * FROM users WHERE username=" + db.escape(username),
          (err, rows) => {
            if (!err) {
              console.log(rows);
              if (rows[0] === undefined) {
                console.log("unique user");
                db.query(
                  "INSERT INTO users (username,email,pass,role) VALUES (" +
                    db.escape(username) +
                    "," +
                    db.escape(email) +
                    "," +
                    db.escape(hash) +
                    ", 0" +
                    ")",
                  (err, row) => {
                    if (!err) {
                      console.log("yo!! welcome to the fam");
                      res.redirect("/");
                    } else {
                      console.log(err);
                    }
                  }
                );
              }
            } else console.log(err);
          }
        );
      } else {
        console.log(err);
      }
    });
  } else {
    res.send("Both passwords not same");
  }
};

//logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("err in logging out");
      //return res.redirect("/acad");
    }
    res.clearCookie(process.env.SESS_NAME);
    res.redirect("/");
  });
};
