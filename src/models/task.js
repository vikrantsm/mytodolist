const mongoose =  require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        require: true,
        trim: true
    },
    done: {
        type: Boolean,
        require: true,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    }
},{
    timestamps: true
})

const Task = mongoose.model('Task',taskSchema)

module.exports = Task