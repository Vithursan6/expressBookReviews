const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

//Check if user already exists
const doesExist = (username) => {
    // Filter users array for any user with the same name
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    //Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  //check if both username and password are provided
  if (username && password) {

    //check if user does already exists
    if (!doesExist(username)) {
        //add new user to users array
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// // Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   // Get all books
//   res.send(JSON.stringify(books, null, 4));
  
// });

const API_BASE_URL = 'http://localhost:5000/api';

//GET all books using axios async
public_users.get("/", async function (req, res) {
    try {
        const response = await axios.get(`${API_BASE_URL}/books`);
        res.send(response.data);
    } catch (error) {
        res.status(500).send({ message: "Error fetching books!" });
    }
});

// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   const isbnId = req.params.isbn;
  
//   res.send(books[isbnId]);
//  });

//GET books by isbn number using axios async await
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get(`${API_BASE_URL}/books/${isbn}`);
        if (response.data){
            res.json(response.data);
        } else {
            res.status(404).json({ message: "Book not found!" });
        } 
    } catch (error) {
        res.status(500).json({ message: " Error fetching book details!" });
    }
});
  
// // Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   const author = req.params.author.toLowerCase();

// //filter books by author
// const matchedBooks = Object.values(books).filter(book =>
//     book.author.toLowerCase() === author);
    
//     if (matchedBooks.length > 0) {
//         res.json(matchedBooks);
//     } else {
//         return res.status(404).json({message: "No book found by this author."});
//     }
//   });

//GET book details based on author using axios async await
public_users.get('/author/:author', async (req,res) => {
    try {
        const author = req.params.author.toLowerCase();
        const response = await axios.get(`${API_BASE_URL}/books`);
        const matchedBooks = Object.values(response.data).filter(book =>
        book.author.toLowerCase() === author);

        if (matchedBooks.length > 0) {
            res.json(matchedBooks);
        } else {
            res.status(404).json({ message: "No books found with this author" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books data!" });
    }
});

 


// // Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   const title = req.params.title.toLowerCase();
  
//   //filter books by title
//   const matchedBooks = Object.values(books).filter(book =>
//     book.title.toLowerCase() === title);

//     if (matchedBooks.length > 0) {
//         res.json(matchedBooks);
//     } else {
//         return res.status(404).json({message: "No books found with this title."});    
//     }
  
// });

//GET all books based on title using axios async await
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();
        const response = await axios.get(`${API_BASE_URL}/books`);
        const matchedBooks = Object.values(response.data).filter(book =>
        book.title.toLowerCase() === title);

        if (matchedBooks.length > 0) {
            res.json(matchedBooks);
        } else {
            res.status(404).json({ message: "No books found with this title!"});
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  //find book with matching isbn
   if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "No book found with ISBN:" + isbn });
  }
  
});

module.exports.general = public_users;
