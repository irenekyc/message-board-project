const path = require ('path')
const express = require ('express')
const app = express()
const PORT = process.env.PORT
const bodyParser = require('body-parser')
const Message = require('./messageModel')
require('./mongoose')
const moment = require('moment');
const Filter = require ('bad-words')
const ejs = require ('ejs')


const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates')


app.set('view engine', 'ejs')
app.set('views', viewsPath)

app.use(express.static(publicDirectoryPath))
app.use(bodyParser.urlencoded({ extended: true })); 

app.listen(PORT, ()=>{
    console.log('Hi there! Server is now up on ' + PORT)
})

app.get('/', async (req, res)=>{
    try{
        const object = await Message.find({}).sort({'createdAt' :'descending'}).limit(3)
        object.forEach((e)=>{
            e.createDate = moment(e.createdAt).format("DD MMM YY")
        })
        res.render('index', {object})
    }
    catch{(err)=>
        console.log(err)
    }
    
})

// Filter & sort 
app.get('/filter', async (req,res)=>{
    const categoryQuery = req.query.category
    const page = parseInt(req.query.page) 
    const sortQuery = req.query.sort || 'descending' 
    const resPerPage = 5
    try {
        if (categoryQuery) {
            const foundMessages = await Message.find({categories: categoryQuery})
            const pages = await Math.ceil(foundMessages.length / resPerPage)
            const object = await Message.find({categories: categoryQuery})
            .sort({'createdAt' : sortQuery})
            .skip((resPerPage * page) - resPerPage)
            .limit(resPerPage)
            console.log(pages)
            object.forEach((e)=>{
                e.createDate = moment(e.createdAt).format("DD MMM YY")
                       })
            return res.render('message.ejs', {object, currentPage:page, pages, categoryQuery})
        
        } else {
            const foundMessages = await Message.find({})
            const pages = await Math.ceil(foundMessages.length / resPerPage)
            const object = await Message.find({})
            .sort({'createdAt' : sortQuery})
            .skip((resPerPage * page) - resPerPage)
            .limit(resPerPage)
            object.forEach((e)=>{
                 e.createDate = moment(e.createdAt).format("DD MMM YY")
                })
            return res.render('message.ejs', {object, currentPage:page, pages, categoryQuery:false})
        }
    }
    catch(err) {
        throw new Error(err);
      }
    })


app.get('/write', (req, res)=>{
    res.render('write', {
    
    })
})



app.post('/save', async (req, res)=>{
        const message = await new Message(req.body)
        const filter = new Filter()
        if (filter.isProfane(message.username) || filter.isProfane(message.message)){
            return res.render('saveFailed', {
                message: 'Profanity is restricted in this page! Thank you for your understanding!'
            })
        }
        message.save().then(()=>{
          res.render('save', {
              username: message.username
          })

        }).catch(()=>
        {
            res.render('saveFailed', {
                message: 'All fields are required. Please complete all field to send a message'
            })
        })
})

app.get('*', (req, res)=>{
    res.render('404')
})
