const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  articles:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article"
  }]
})



module.exports = mongoose.model('User', userSchema)

// var mongoose = require('mongoose');
// var bcrypt = require('bcrypt');

// var UserSchema = new mongoose.Schema({
//   email: {
//         type: String,
//         unique: true,
//         required: true
//     },
//   password: {
//         type: String,
//         required: true
//     }
// });

// UserSchema.pre('save', function (next) {
//     var user = this;
//     if (this.isModified('password') || this.isNew) {
//         bcrypt.genSalt(10, function (err, salt) {
//             if (err) {
//                 return next(err);
//             }
//             bcrypt.hash(user.password, salt, null, function (err, hash) {
//                 if (err) {
//                     return next(err);
//                 }
//                 user.password = hash;
//                 next();
//             });
//         });
//     } else {
//         return next();
//     }
// });

// UserSchema.methods.comparePassword = function (passw, cb) {
//     bcrypt.compare(passw, this.password, function (err, isMatch) {
//         if (err) {
//             return cb(err);
//         }
//         cb(null, isMatch);
//     });
// };

// module.exports = mongoose.model('User', UserSchema);
