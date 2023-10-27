require('dotenv').config();
const url = process.env.MONGODB_URI;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const path = require('path');           
const PORT = process.env.PORT || 5000;

const app = express();
app.set('port', (process.env.PORT || 5000));
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.post('/api/register', async (req, res, next) =>
{
	
  const { username, password, email } = req.body;

  const newUser = {Username:username, Password:password, Email:email, Answers:[]};
  var error = '';

  try
  {
    const db = client.db('COP4331_LargeProject');
    const result = db.collection('Users').insertOne(newUser);
  }
  catch(e)
  {
    console.log("Hello!");
    error = e.toString();
  }

  var ret = { error: error };
  res.status(200).json(ret);
});

app.post('/api/login', async (req, res, next) => 
{
	
 var error = '';

  const { login, password } = req.body;

  const db = client.db('COP4331_LargeProject');
  const results = await db.collection('Users').find({Username:login,Password:password}).toArray();

  var id = -1;

  if( results.length > 0 )
  {
    id = results[0]._id;
  }

  var ret = { id:id, error:''};
  res.status(200).json(ret);
});


app.post('/api/searchcards', async (req, res, next) => 
{
  // incoming: userId, search
  // outgoing: results[], error

  var error = '';

  const { userId, search } = req.body;

  var _search = search.trim();
  
  const db = client.db('COP4331Cards');
  const results = await db.collection('Cards').find({"Card":{$regex:_search+'.*', $options:'i'}}).toArray();
  
  var _ret = [];
  for( var i=0; i<results.length; i++ )
  {
    _ret.push( results[i].Card );
  }
  
  var ret = {results:_ret, error:error};
  res.status(200).json(ret);
});

app.listen(PORT, () => 
{
  console.log('Server listening on port ' + PORT);
});

///////////////////////////////////////////////////
// For Heroku deployment

// Server static assets if in production
if (process.env.NODE_ENV === 'production') 
{
  // Set static folder
  app.use(express.static('frontend/build'));

  app.get('*', (req, res) => 
 {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

app.post('/api/numQuestions', async (req, res, next) =>
{

  var result = 0;
  var error = '';

  try
  {
    const db = client.db('COP4331_LargeProject');
    result = await db.collection('Questions').countDocuments({});
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = { numQuestions: result, error:''};
  res.status(200).json(ret);
});