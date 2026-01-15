const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');



const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  userName: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: "Invalid email format"
    }
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters long']
  },
  bio: {
    type: String,
    maxlength: [50, 'Bio should be less than 50 characters']
  },
  tel: {
    type: String,
   
    validate: {
      validator: function (v) {
        return !v|| /^\+?[0-9]{7,15}$/.test(v);

      },
      message: "Incorrect telephone format"
    }
  },
contacts: [{
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  chatId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true
    },
  addedAt: {
    type: Date,
    default: Date.now
  },

  nickname: String ,
  unreadCount: { type: Number, default: 0 } 
}],
  profilePicture:String,
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now }

}, 
{ timestamps: true });


// encrypting (hashing ) password pre saving 

userSchema.pre('save', async function(next) {
    try {
        if (this.isModified('password') && this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch (err) {
        console.error("ERROR : couldn't hash the password ", err);
        next(err);
    }
});

// login static method 
userSchema.statics.login = async function (userName, password) {
  const user = await this.findOne({ userName });
  if (!user) {
    throw new Error("Invalid username or password");
  }

  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    throw new Error("Invalid username or password");
  }

  return user;
};




const User = mongoose.model('User',userSchema);


module.exports= User;