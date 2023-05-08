const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    age: {
        type: Number,
        min: 1,
        max: 100,
        // validate : {
        //     validator: v => v % 2 === 0,
        //     message: props => `${props.value} is not a even number`
        // }
    },
    address: {
        street: {type: String},
        city: {type: String},
    },
    hobbies: { type : Array , "default" : [] },
    balance: Number,
    debt: Number,
})
 
// userSchema.methods.sayHi = function(user) {
//     console.log(`hi my name is ${user.name}`);
// }


module.exports = mongoose.model("User", userSchema);