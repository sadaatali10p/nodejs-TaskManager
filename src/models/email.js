const mongoose = require('mongoose')

const Email = mongoose.model('Email', {
    to: {
        type: String        
    },
    from: {
        type: String
    },
    subject: {
        type: String        
    },
    body: {
        type: String        
    },
    html: {
        type: String
    }
})

module.exports = Email