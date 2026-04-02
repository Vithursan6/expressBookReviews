const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
// Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  req.session.username = username;

  //Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error loggin in" });

  }


//Authenticate User
if (authenticatedUser(username, password))  {
    // Generate JWT acces token
    let accessToken = jwt.sign({
        date: password
    }, 'access', { expiresIn: 60 });

    //Store access token and username in session
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User successfully logged in.");
    } else {
        return res.status(200).json({ message: "Invalid login. Check your username and password."});
    }

});

function sessionChecker(req, res, next) {
  if (req.session && req.session.username) {
    next(); // User is logged in, proceed to the next middleware or route handler
  } else {
    return res.status(401).json({ message: "User not logged in!" });
  }
}

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.session.username;
  console.log("JWT verified, user:", username);
  const review = req.body.review;
  console.log("review submitted:", review);

  

  if (!username) {
    return res.status(401).json({ message: "User not logged in!! "});
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: " Book not found. "});
  }

  if (!review) {
    return res.status(400).json({ message: " Review content missing! "});
  }

  //Add or update review for the user on the book
  books[isbn].reviews[username] = review;

  return res.status(200).json({message: "Review added/modifed successfully", reviews: books[isbn].reviews });
});

// regd_users.put("/auth/review/test", (req, res) => {
//     const username = req.session.username
//     console.log("JWT verified, user:", username);
//     res.send("PUT route is working");
// });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
