import db from "./db.js";

export function registerAccount(login, password) {

  if (login == "admin" && password == "admin") {
    return false; // cant register admin
  }

  const existing = db.getData(
    "SELECT * FROM accounts WHERE login = ?",
    [login]
  );

  if (!existing) {
    db.runData(
      "INSERT INTO accounts (login, password) VALUES (?, ?)",
      [login, password]
    );

    const user = db.getData(
      "SELECT * FROM accounts WHERE login = ?",
      [login]
    );

    return user.id;
  }

  return false;
}

export function loginAccount(login, password) {

  if (login == "admin" && password == "admin") {
    return -1; // Admin user id is -1
  }

  const user = db.getData(
    "SELECT * FROM accounts WHERE login = ? AND password = ?",
    [login, password]
  );

  console.log("DB result:", user);

  if (user) return user.id;
  return false;
}

function requireLogin(req, res, next) {
  if (!req.session.user_id) {
    return res.redirect("/login/");
  }
  next();
}

export default {
  registerAccount,
  loginAccount,
  requireLogin
};