const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRouter');
const cors = require('cors');
const app = express();
dotenv.config();
connectDB();
app.use(express.json())
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001']; 
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/', (req,res) => {
    res.send("Api is running");
});

app.use('/api/users', userRoutes); 


app.listen(process.env.PORT, console.log(`Server started on Port ${process.env.PORT}`));