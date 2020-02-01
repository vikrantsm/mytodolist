const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = "assignment"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password:{
        type:String,
        require: true,
        trim: true,        
        minlength: [4,'Password must be longer than 4 characters']
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
},{
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'userId'
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.tokens
    delete userObject.password
    delete userObject.avatar


    return userObject
}

//Instance method
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({ _id: user._id.toString()},JWT_SECRET)

    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (name, password) => {
    const user = await User.findOne({ name })
    if(!user){
        throw new Error('Unable to login')
    }
    const isValid = await bcrypt.compare(password, user.password)
    if(!isValid){
        throw new Error('Unable to login')
    }
    return user
}

//before saving user model.
userSchema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User