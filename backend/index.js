const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const userRoute = require('./routes/userRoute.js');
const authRoute = require('./routes/authRoute.js');
const postRoute = require('./routes/postRoute.js');


dotenv.config();

const app = express();

mongoose.connect(
	process.env.MONGO_CONNECTION_STRING,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
);
mongoose.connection.once('open',
	()=> console.log("Server is now connected to MongoDB Atlas.")
);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());
app.use(morgan('common'));

app.use('/users', userRoute);
app.use('/auth', authRoute);
app.use('/post', postRoute);

app.listen(process.env.PORT || 8080, ()=> {
	console.log(`Server is now running on port 8080`);
});