const mongoose = require ('mongoose')

const messageSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
        trim:true,
    },
    categories: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
     trim: true
    },
    createdate: {
        type:Date,
    }
    
}, {timestamps: true})

const Message = mongoose.model('Messages', messageSchema)



module.exports = Message