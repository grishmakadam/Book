const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const requireAuth=require("../middleware/requireAuth")
const User=require('../models/user')

router.use(requireAuth)

router.get('/', async (req, res) => {
    console.log(req.user)
    try {
        const {_id}=req.user
        const books = await User.findById({_id}).populate('books')
        res.json(books.books)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/', async (req, res) => {
    const book = new Book({
        name: req.body.name,
        author: req.body.author,
        dateOfPublish: req.body.date,
        price: req.body.price,
        ISBN: req.body.isbn,
        Status: req.body.status
    })
    try {
        const newbook = await book.save()
        req.user.books.push(newbook._id)
        await req.user.save()
        res.status(201).json(newbook)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.get('/:id', getBookById, (req, res) => {
    res.status(200).send(res.book)
})

router.delete('/:id', getBookById, async (req, res) => {
    try {
        await res.book.remove()
        res.json('book deleted')
    } catch (e) {
        res.status(500).json({ message: err.message })
    }
})


router.delete('/', async (req, res) => {
    try {
        await Book.remove()
        res.json('deleted all books')
    }
    catch (e) {
        res.status(500).json({ message: e.message })
    }
})

router.patch('/:id', getBookById, async (req, res) => {
    console.log(res.book)
    console.log(req.body)
    res.book.name = req.body.name
    res.book.author = req.body.author
    res.book.dateOfPublish = new Date(req.body.date)
    res.book.Status = req.body.status
    if (req.body.price != '') {
        res.book.price = parseInt(req.body.price)
    }
    res.book.ISBN = req.body.isbn
    console.log(res.book)

    try {

        let resp = await res.book.save()
        res.json(resp)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


async function getBookById(req, res, next) {
    let book
    try {
        book = await Book.findById(req.params.id)
        if (book == null) {
            return res.status(404).json("Book not found")

        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
    res.book = book
    next()
}




module.exports = router