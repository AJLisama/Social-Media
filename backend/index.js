const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoute = require('./routes/authRoute.js');
const userRoute = require('./routes/userRoute.js');

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
mongoose.connection.once('open',
	()=> console.log("Connected to MongoDB Atlast")
);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());
app.use(morgan('common'));

app.use('/auth', authRoute);
app.use('/users', userRoute);

app.listen(process.env.PORT || 8080, ()=> {
	console.log(`Server is now running on port 8080`)
})