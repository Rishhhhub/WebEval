// ---------------------------
// --- IMPORTS AND SETUP ---
// ---------------------------
require('dotenv').config(); // Loads .env file
const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');

// ---------------------------
// --- MIDDLEWARE ---
// ---------------------------
// Set the view engine to EJS
app.set('view engine', 'ejs');

// Tell Express where your static files (js, images) are
app.use(express.static('public'));

// These lines let your server read form data
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// ---------------------------
// --- DATABASE CONNECTION ---
// ---------------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// ---------------------------
// --- PAGE ROUTES ---
// ---------------------------
// Home page
app.get('/', (req, res) => {
  res.render('landing'); 
});

// Courses page
app.get('/courses', (req, res) => {
  res.render('courses');
});

// Notes page
app.get('/notes', (req, res) => {
  res.render('notes');
});

// Books page
app.get('/books', (req, res) => {
  res.render('books');
});

// Subjects page
app.get('/subjects', (req, res) => {
  res.render('Subject'); 
});

// GET route to show the upload form for books
app.get('/upload-book', (req, res) => {
  res.render('upload-book');
});

// GET route to show the upload form
app.get('/upload-note', (req, res) => {
  res.render('upload-note');
});

// GET route to show the upload form for courses
app.get('/upload-course', (req, res) => {
  res.render('upload-course');
});

// ---------------------------
// --- API ROUTES (CRUD) ---
// ---------------------------
// Import all your models
const Course = require('./models/Course');
const Note = require('./models/Note');
const Book = require('./models/Book');

// --- READ (R) ---

// READ (Get all Courses)
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ (Get all Notes - NOW WITH PAGINATION)
app.get('/api/notes', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get page number from query, default to 1
    const limit = 3; // We want 3 notes per page
    const skip = (page - 1) * limit; // Calculate how many notes to skip

    // Get the total count of notes for calculating total pages
    const totalNotes = await Note.countDocuments();
    
    // Get just the notes for the current page, sorted by newest first
    const notes = await Note.find()
      .sort({ _id: -1 }) 
      .skip(skip)
      .limit(limit);

    // Send back the notes, total pages, and current page
    res.json({
      notes: notes,
      totalPages: Math.ceil(totalNotes / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ (Get all Books)
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- CREATE (C) ---

// CREATE (Post a new Book)
app.post('/api/books', async (req, res) => {
  try {
    const newBook = new Book({
      title: req.body.title,
      author: req.body.author,
      subject: req.body.subject,
      description: req.body.description,
      coverUrl: req.body.coverUrl,
      downloadUrl: req.body.downloadUrl
    });

    await newBook.save();
    res.redirect('/books'); // Success! Go back to the books page.

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// CREATE (Post a new Note)
app.post('/api/notes', async (req, res) => {
  try {
    const newNote = new Note({
      title: req.body.title,
      category: req.body.category,
      meta: req.body.meta,
      image: req.body.image
    });

    await newNote.save();
    res.redirect('/notes?success=Note+Uploaded+Successfully'); // Success! Go back to the notes page.
  
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// CREATE (Post a new Course)
app.post('/api/courses', async (req, res) => {
  try {
    const newCourse = new Course({
      title: req.body.title,
      type: req.body.type,
      description: req.body.description,
      image: req.body.image
    });

    await newCourse.save();
    res.redirect('/courses'); // Success! Go back to the courses page.

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- DELETE (D) ---

// DELETE (Delete a Note by ID)
app.post('/api/notes/delete/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.redirect('/notes?error=Note+Deleted'); // Success! Go back to the notes page.
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// ... after your app.post('/api/notes/delete/:id') route ...

// DELETE (Delete a Book by ID)
app.post('/api/books/delete/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/books'); // Success! Go back to the books page.
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE (Delete a Course by ID)
app.post('/api/courses/delete/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.redirect('/courses?error=Course+Deleted'); // Redirect back to courses page
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ---------------------------
// --- START THE SERVER ---
// ---------------------------
app.listen(port, () => {
  console.log(`✅ Server is running!`);
  console.log(`Visit http://localhost:${port} to see your site.`);
});