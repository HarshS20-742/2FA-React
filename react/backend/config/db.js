const mongoose = require('mongoose');

const connectDB = async() =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);

        console.log(`Connected Mongo to the server: ${conn.connection.name}`);

    }catch(err){
        console.log("the error is:" ,err);
        process.exit();

    }
};

module.exports = connectDB;