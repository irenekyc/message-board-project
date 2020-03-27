const mongoose = require ('mongoose')

mongoose.connect(process.env.dbURL, {
 useNewUrlParser: true,
 useCreateIndex: true,
 useFindAndModify: false
})
