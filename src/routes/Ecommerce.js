require('dotenv').config();
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const shortid = require('shortid');

//models
const User = require('../models/User');
const Blogs = require('../models/blogs');

const bodyParser = require('body-parser');
router.use(bodyParser.text());



module.exports = router;
