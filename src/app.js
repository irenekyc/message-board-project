const path = require ('path')
const express = require ('express')
const app = express()
const PORT = process.env.PORT
const bodyParser = require('body-parser')
const Message = require('./messageModel')
require('./mongoose')
const hbs = require('hbs')
const moment = require('moment');
const Filter = require ('bad-words')

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')


app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))
app.use(bodyParser.urlencoded({ extended: true })); 

app.listen(PORT, ()=>{
    console.log('Hi there! Server is now up on ' + PORT)
})

app.get('/', (req, res)=>{
    Message.find({}).sort({'createdAt' :'descending'}).limit(5)
    .then((messages)=>{
        const object = messages        
        object.forEach((e)=>{
            e.createDate = moment(e.createdAt).format("DD MMM YY")
        })
        res.render('index', {Message : object})
    }).catch()
    
})

//ALL Messages 
///*************Need Pagination */
app.get('/messages', (req, res)=>{

    const page = parseInt(req.query.page)
    const resPerPage = 5
    Message.find({})
    .sort({'createdAt' :'descending'})
    .skip((resPerPage * page) - resPerPage)
    .limit(resPerPage)
    .then((messages)=>{
        const object=messages
        object.forEach((e)=>{
            e.createDate = moment(e.createdAt).format("DD MMM YY")
        })
        res.render('index', {Message : object})
    })
    .catch((e)=>{
        console.log(e)
    })
})

// Filter & sort 
app.get('/messages/filter', async (req,res)=>{
    const categoryQuery = req.query.category
    const page = parseInt(req.query.page) 
    const sortQuery = req.query.sort || 'descending' 
    const resPerPage = 2
    try {
        if (categoryQuery) {
            const foundMessage = await Message.find({categories: categoryQuery})
            .sort({'createdAt' : sortQuery})
            .skip((resPerPage * page) - resPerPage)
            .limit(resPerPage)
            // const numOfProducts = await Message.count({categories: categoryQuery});
            return res.render('index', {Message : foundMessage})
        
        } else {
            const foundMessage = await Message.find({})
            .sort({'createdAt' : sortQuery})
            .skip((resPerPage * page) - resPerPage)
            .limit(resPerPage)
            // const numOfProducts = await Message.count({categories: categoryQuery})
            return res.render('index', {Message : foundMessage})
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
        const message = new Message(req.body)
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
