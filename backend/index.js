const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_CONNECTION_STRING,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
);
mongoose.connection.once('open',
	()=> console.log('Connected to MongoDB Atlas')
);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());

app.listen(process.env.PORT || 8080, ()=> {
	console.log(`Server is now running at port ${PORT}`)
})