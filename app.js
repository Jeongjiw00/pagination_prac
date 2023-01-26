const express = require("express");
const app = express();

/* movies */
const movies = require("./models/movies");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
