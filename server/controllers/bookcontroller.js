const db = require("../../database.js", { root: "." });
const express = require("express");
const res = require("express/lib/response");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//books views
exports.book = (req, res) => {
  if (req.session.userinfo) {
    console.log("view requested");
    let role1 = req.data || req.session.userrole;
    console.log(role1);
    let queryto = "";
    if (req.query.search) {
      console.log("search");
      queryto =
        "SELECT * FROM books WHERE bookname=" + db.escape(req.query.search);
    } else if (req.session.userrole === 1) {
      queryto = "SELECT * FROM books ORDER BY id DESC";
    } else {
      queryto = "SELECT * FROM books WHERE avail = 1 ORDER BY id DESC";
    }
    db.query(queryto, (err, rows) => {
      if (!err) {
        if (rows[0] === undefined) {
          res.send("Sorry no books found in library");
        } else {
          console.log("rend start");
          let rowData = Object.values(JSON.parse(JSON.stringify(rows)));
          let newData = { info: rowData, role: role1 };
          console.log(newData);
          res.render("data", { layout: "books", data: newData });
        }
      } else {
        console.log(err);
      }
    });
  } else {
    res.redirect("/");
  }
};

//book checkout
exports.booksubmit = (req, res) => {
  console.log("checkout posted");
  const { bookid } = req.body;
  const username = req.session.userinfo;
  db.query(
    "SELECT * FROM books WHERE id=" + db.escape(bookid) + " AND avail=1",
    (err, rows) => {
      if (!err) {
        if (rows[0] === undefined) {
          res.send("book unavailiable for checkout");
        } else {
          db.query(
            "SELECT * FROM requests WHERE username=" +
              db.escape(username) +
              " AND returned = 0 AND bookid=" +
              db.escape(bookid) +
              " AND (status=1 OR status=2)",
            (err, rows) => {
              if (!err) {
                if (rows[0] === undefined) {
                  db.query(
                    "INSERT INTO requests(bookid,username,status,returned) VALUES(" +
                      db.escape(bookid) +
                      "," +
                      db.escape(username) +
                      ",2,0)",
                    (err, rows) => {
                      if (!err) {
                        res.send("checkout done, waiting for approval!");
                      } else {
                        console.log(err);
                      }
                    }
                  );
                } else {
                  res.send("you already have this book");
                }
              }
            }
          );
        }
      } else {
        console.log(err);
      }
    }
  );
};

//book approval render
exports.bookapprovalrender = (req, res) => {
  console.log("admin request");
  db.query("SELECT * FROM requests WHERE status=2", (err, rows) => {
    if (!err) {
      let rowData = Object.values(JSON.parse(JSON.stringify(rows)));
      res.render("requests", { layout: "reqlayout", data: rowData });
    } else {
      console.log(err);
    }
  });
};
//book approval protocol
exports.bookresolve = (req, res) => {
  console.log("book protocol called");
  const { id, status, bookid } = req.body;
  if (status === 1) {
    console.log("hi");
    db.query(
      "SELECT * FROM books WHERE id=" + db.escape(bookid),
      (err, rows) => {
        if (err) throw err;
        let querytobe;
        if (rows[0].number === 1) {
          querytobe =
            "UPDATE books SET number=" +
            db.escape(rows[0].number - 1) +
            " ,avail=0" +
            " WHERE id=" +
            db.escape(bookid);
        } else {
          querytobe =
            "UPDATE books SET number=" +
            db.escape(rows[0].number - 1) +
            " WHERE id=" +
            db.escape(bookid);
        }
        db.query(querytobe, (err, rows) => {
          if (err) throw err;
          console.log("booknumber updated");
        });
      }
    );
  }
  db.query(
    "UPDATE requests SET status=" +
      db.escape(status) +
      ",resolveby=" +
      db.escape(req.session.userinfo) +
      ",returned=0" +
      " WHERE id=" +
      db.escape(id),
    (err, rows) => {
      res.send("resolved");
    }
  );
};
//past all resolved
exports.pastresolve = (req, res) => {
  console.log("user search by admin");
  db.query(
    "SELECT * FROM requests WHERE username=" +
      db.escape(req.query.username) +
      "ORDER BY id DESC",
    (err, rows) => {
      if (!err) {
        console.log(rows);
        let rowData = Object.values(JSON.parse(JSON.stringify(rows)));
        res.render("requests", { layout: "reqlayout", data: rowData });
      } else {
        console.log(err);
      }
    }
  );
};
//past user resolved
exports.userresolved = (req, res) => {
  console.log("user called history");
  db.query(
    "SELECT * FROM requests WHERE username=" +
      db.escape(req.session.userinfo) +
      "ORDER BY id DESC",
    (err, rows) => {
      if (!err) {
        let rowData = Object.values(JSON.parse(JSON.stringify(rows)));
        res.render("history", { layout: "books", data: rowData });
      } else {
        console.log(err);
      }
    }
  );
};
//add books
exports.addbook = (req, res) => {
  const { bookname, number } = req.body;
  db.query(
    "SELECT * FROM books WHERE bookname=" + db.escape(bookname),
    (err, rows) => {
      if (err) throw err;
      if (rows[0] === undefined) {
        db.query(
          "INSERT INTO books (bookname,number,avail) VALUES(" +
            db.escape(bookname) +
            "," +
            db.escape(number) +
            ",1)",
          (err, rows) => {
            if (!err) {
              res.send("book added");
            } else {
              console.log(err);
            }
          }
        );
      } else {
        let updatenumber = parseInt(number) + rows[0].number;
        db.query(
          "UPDATE books SET number=" +
            db.escape(updatenumber) +
            " WHERE bookname=" +
            db.escape(bookname),
          (err, rows) => {
            if (err) throw err;
            res.send("updated number of an existing books");
          }
        );
      }
    }
  );
};
//update book
exports.updatebooks = (req, res) => {
  console.log("update called change");
  const { id, avail } = req.body;
  db.query(
    "UPDATE books SET avail=" + db.escape(avail) + " WHERE id=" + db.escape(id),
    (err, rows) => {
      if (!err) {
        res.send("updated");
      } else {
        console.log(err);
      }
    }
  );
};

//return books
exports.returnbooks = (req, res) => {
  const { id, bookid } = req.body;
  db.query("SELECT * FROM books WHERE id=" + db.escape(bookid), (err, rows) => {
    if (err) throw err;
    let querytobe1;
    if (rows[0].number === 0) {
      querytobe1 =
        "UPDATE books SET number=" +
        db.escape(rows[0].number + 1) +
        " ,avail=1" +
        " WHERE id=" +
        db.escape(bookid);
    } else {
      querytobe1 =
        "UPDATE books SET number=" +
        db.escape(rows[0].number + 1) +
        " WHERE id=" +
        db.escape(bookid);
    }
    db.query(querytobe1, (err, rows) => {
      if (err) throw err;
      console.log("booknumber updated");
      db.query(
        "UPDATE requests SET returned=1 WHERE id=" + db.escape(id),
        (err, rows) => {
          if (err) throw err;
          console.log("returned successfully");
          res.send("returned success");
        }
      );
    });
  });
};
