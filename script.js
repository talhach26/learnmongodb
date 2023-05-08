const mongoose = require('mongoose');
const User = require('./User')

mongoose.connect("mongodb://localhost:27017/testdb", () =>  {
    console.log('connected');
}, err => console.log(err));

// run()

async function run () {
    try {
        const user = await User.insertMany([{name: 'mand', age: 40, address: {street: 'gulshan colony', city: 'gujrat', balance: 100, debt: 300}, hobbies: ["gym", "coding"]},
        {name: 'ahsan', age: 50, address: {street: 'gulshan colony', city: 'gujrat'}, hobbies: ["gym", "coding"],  balance: 200, debt: 500}]);
        // user.save();
        console.log(user);
    }catch (err) {
        console.log(err);
    }
}

//get()

async function get () {
    try {
        // const user = await User.aggregate([
        //     { $match: {age : { $gt: 20, $lt:22 }} }
        // ])
        const user = await User.find({age: {$exists: true, $in: [ 21, 25, 23 ] }}).limit(100);
        // user.save();
        console.log(user);
    }catch (err) {
        console.log(err);
    }
}

// in aggregation pipeline 1st we do match operation for simple find then we apply group for farther divide
//into according to required results and

//syntax
//   model.aggregate([
//    <>stage1</>,
//    <>stage2</>,
//      ...
//    <>stage3</>,
//   ])

// each stage in aggregate pipleline take all doc as input and make result then farward to next stage and so and
// each stage start from { $<stageOperator> : {} }
// example {$match: {age: {$gt: 20 } }}
// $match, $group, $project, $sort, $count, $limit, $skip, $out

//syntax() 
async function syntax () {
    try {
        const user = await User.aggregate([
           { $match: { gender: "male"}}
           // { $match: { tags : {$size : 3}}} array having size 3
          // { $match: { age : {$gt : 25}}}
          // { $match: { $and : [{gender: 'female}, {age : {$gt: 25}}]}}
          // { $match: { $or : [{gender: 'female}, {age : {$gt: 25}}]}}
        ]);
        console.log(user);
    }catch (err) {
        console.log(err);
    }
}

// group stage => $<fieldName> => {$group : {_id : "$age"}} becasue we use field name as value thats why written in double quots with $.
//examples {$group : {_id : "$company.location.country"}}
//examples {$group : {_id : "$name", total: {$sum : "$price"}}} => here name and price are field names
//group() 
async function group () {
    try {
        const user = await User.aggregate([
           { $group: { _id: "$age"}}
          // { $group: { _id: "$eyeColor"}} => {id: green},{id:blue},{id:brown} => group all distinct values
          //{ $group: { _id: {age: "$age", gender: "$gender"}}}
         // { $group: { _id: {eyeColor: "$eyeColor", favoriteFruit: "$favoriteFruit", age: "$age"}}}
         // {$group : {_id : "$company.location.country"}}
        // {$group : {_id : "$company"}}
        ]);
        console.log(user);
    }catch (err) {
        console.log(err);
    }
}

//match and group combine
//matchGroup() 
async function matchGroup () {
    try {
        const user = await User.aggregate([
          { $match: {favoriteFruit: "banana"}}, //match stage should be above from group stage 
          { $group: {_id: {age: "$age", eyeColor: "$eyeColor"}}}
        ]);
        console.log(user);
    }catch (err) {
        console.log(err);
    }
}

// in this case we can use group stage 1st and match on secoonnd
//matchGroupChnageOrder() 
async function matchGroupChnageOrder () {
    try {
        const user = await User.aggregate([
        { $group: {_id: {age: "$age", eyeColor: "$eyeColor"}}},
        { $match: { "_id.age": { $gt: 30 }}}, //because now we are getting age from resulted documents by group stage
          
        ]);
        console.log(user);
    }catch (err) {
        console.log(err);
    }
}

//count stage 3
//count() 
async function count () {
    try {
        const user = await User.aggregate([
        { $count: "age"}, //in count we need to pass string of field name and its retuen object {age: 999}
          
        ]);
        console.log(user);
    }catch (err) {
        console.log(err);
    }
}

groupMatchCount() 
async function groupMatchCount () {
    try {
        const user = await User.aggregate([
        { $match: {age : {$gte: 25}}},    
        { $group: {_id: {eyeColor: "$eyeColor", gender: "$gender" }}},
        { $count: "eyeColorAndGender" } //result would 6 because 2 types of gender and 3 types of eyes color
          
        ]);
        console.log(user);
    }catch (err) {
        console.log(err);
    }
}

//sort() 
async function sort () {
    try {
        const user = await User.aggregate([
      //  { $sort: {age : -1, gender: 1, eyeColor: 1}},    // 1 for accending -1 for decending
    //   { $group: { _id : "$favoriteFruit" } },
    //   { $sort: {_id: 1} }
         { $group : { _id: {eyeColor: "$eyeColor", gender: "$gender"} } },
         { $sort: {"_id.eyeColor":-1, "_id.gender": 1} }   
        ]);
        console.log(user);
    }catch (err) {
        console.log(err);
    }
}

// project for select fields in document 
//project() 
async function project () {
    try {
        const user = await User.aggregate([
            // { $project: {name: 1, age: 1} }
            // { $project: {name: 1, newAge: "$age"} } // for rename age field
            // { $project: {_id: 0 ,"$company.location.country": 1 } }
            { $project: { _id: 0, name: 1,  info: { eyes: "$eyeColor", fruit: "$favoriteFruit", country: "$company.location.country" }}}
         
        ]);
        console.log(user);
    }catch (err) {
        console.log(err);
    }
}

//limit() 
async function limit () {
    try {
        const user = await User.aggregate([
           { $limit: 100 },
           { $match: { age: { $gt: 27 } } },
           { $group: { _id: {country:"$company.location.country", gender:"$gender" }} },
           { $sort: { "_id.country" : -1 } }
        ]);
        console.log(user);
    }catch (err) {
        console.log(err);
    }
}

//unwind stage take documnets ass input and make several new doc after that we can apply match and group 
// tags[a, b, c, d]
// {tags: a}, {tags: b}, {tags: c}, {tags: d} after unwind stage
//unwind mostly uses with group stage
//unwindArraywithgroup() 
async function unwindArraywithgroup () {
    try {
        const user = await User.aggregate([
        { $unwind: "$tags" },
        { $group: { _id: "$tags"} }
        ]);
        console.log(user);
    }catch (err) {
        console.log(err);
    }
}

// Accumulators sum, avg, max, min these are uses with group stage
//sum() 
async function sum () {
    try {
        const user = await User.aggregate([
            // {total: {$sum: "$quantity"}}
            // {count: {$sum: 1}}
        { $match: {age: 25} },   
        { $group: { _id: "$age", count: {$sum: 1}} }
        ]);
        console.log(user);
    }catch (err) {
        console.log(err);
    }
}

//sumUnwind() 
async function sumUnwind () {
    try {
        const user = await User.aggregate([
        { $unwind: "$tags" },   
        { $group: { _id: "$tags", count: {$sum: 1}} }
        ]);
        console.log(user);
    }catch (err) {
        console.log(err);
    }
}

//avg Accumulator
//avg() 
async function avg () {
    try {
        const user = await User.aggregate([  
       // { $group: { _id: "$eyeColor", avgAge: {$avg: "$age"}} }
       // { $group: { _id: "$company.location.country", avgAge: {$avg: "$age"}} }
       { $match: {eyeColor: "green"} },
       { $group: { _id: "$eyeColor",  minAge: { $min: "$age" } } },
       
        ]);
        console.log(user);
    }catch (err) {
        console.log(err);
    }
}

// unary operators $type, $or, $lt, $gt, $and, $multiply    mostly uses with project stage also we can use in group stage only
// but only in value side
//unary() 
async function unary () {
    try {
        const user = await User.aggregate([  
       // { $project: { name: 1, eyeColor: { $type: "$eyeColor" }, ageType: { $type: "$age" } } },
        { $match: {  age: {$gt: 30} } },
        { $project: {name: 1, age:1} }
       
        ]);
        console.log(user);
    }catch (err) {
        console.log(err);
    }
}

//out for dynamically create collection if not exists and should must use in last stage
//out() 
async function out () {
    try {
        const user = await User.aggregate([  
        { $group: { _id: { eyeColor: "$eyeColor", age: "$age" } } },
        { $out: "newCollection" }
       
        ]);
        console.log(user);
    }catch (err) {
        console.log(err);
    }
}