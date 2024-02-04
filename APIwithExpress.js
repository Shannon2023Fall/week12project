// Load express
const express = require("express");
const app = express();
// Define a port to be listened
const PORT = 5000;
var fs = require('fs');

// Apply necessary middleware ???
app.use(express.json());
// Read the file and send to the callback
const posts = fs.readFile('./db.json', handleFile);
let events;
// Write the callback function
function handleFile(err, posts) {
    if (err) {throw err;}
    events = JSON.parse(posts);
    console.log(events);
    // You can now play with your datas
};

let currentDate = new Date();
console.log(currentDate);
// Define the POST class object
class Post {
    _id = currentDate;

    constructor(gender, age, month) {
        this.gender = gender;
        this.age = age;
        this.month = month;
    }
}

// Define Routes for GET and POST
app.get("/", (req, res, next) => {
    res.send("You have landed on the right place");
  });

app
    .route("/posts")
    .get((req, res, next) => {
        res.status(200).json({
            data: [posts],
            message: "All posts fetched successfully!",
        });
    })
    .post((req, res, next) => {
        const {gender, age, month} = req.body;

        // Check if input data is complete
        if(!gender || !age || !month) {
            return res.status(422).json({
                error: "Input data is incomplete!",
            });
        }

        // Create and add the new post
        const postNew = new Post(gender, age, month);
        posts.push(postNew);

        res.status(201).json({
            data: [posts],
            message: "A new post created successfully!",
        });
    });

// Define Routes for PUT and DELETE
app
    .route("/posts/:id")
    .get((req, res, next) => {
        const postId = req.params.id;

        // Check if the post with given id exists
        const postFound = posts.find((post) => {
            return post._id ===  Number(postId);
        });
        if (!postFound) {
            return res.status(404).json({
            error: "No post found with the given id!",
        });
       }

       res.status(202).json({
        data: [postFound],
        message: "The post data fetched successfully!",
       });
    })

    .put((req, res, next) => {
        const postId = req.params.id;
        const {gender, age, month} = req.body;

        // Check if the post with given id exists
        const postFound = posts.find((post) => {
            return post._id === Number(postId);
        });
        if(!postFound){
            return res.status(404).json({
                error: "No post found with the given id!",
            });
        }

        // Update the post's data if given
        if(gender) postFound.gender = gender;
        if(age) postFound.age = age;
        if(month) postFound.month = month;

        res.status(202).json({
            data: [posts],
            message: "The post updated successfully!",
        });
    })

    .delete((req, res, next) => {
        const postId = req.params.id;

        // Check if the post with given id exists
        const postFoundIndex = posts.findIndex((post) => {
            return post._id === Number(postId);
        });
        if(postFoundIndex < 0){
            return res.status(404).json({
                error: "No post found with the given id!",
            });
        }

        // Remove the post from the database
        posts = posts.filter((post) => {
            return post._id !== Number(postId);
        });

        res.status(202).json({
            data: [posts],
            message: "The post deleted successfully!",
        });
    });

app.listen(PORT, ()=> {
    console.log('The server is listening on port ${PORT}');
});
