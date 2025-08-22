const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const ApiError = require("../utils/ApiError")

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password,10)
    next() 
})

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}

export const user = mongoose.model("User",userSchema)

