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

  var ret = { numQuestions: result, error:error};
  res.status(200).json(ret);
});

app.post('/api/addPost', async (req, res, next) => {
  
  var error = '';

  const { answerId, userId, slug, content } = req.body;

  const newPost = { AnswerId:answerId, UserId:userId, Slug:slug, Content:content, Comments: []}

  try 
  {
    const db = client.db('COP4331_LargeProject');
    const result = db.collection('Post').insertOne(newPost);
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = { error:error};
  res.status(200).json(ret);
});

app.post('/api/getUserById', async (req, res, next) => {
  var error = '';
  var result = null;

  const { userId } = req.body;

  try
  {
    const db = client.db('COP4331_LargeProject');
    result = await db.collection('Users').find({UserId:userId}).toArray();
  }
  catch(e)
  {
    error = e.toString();
  }
  
  var ret = { user: result[0], error: error }
  res.status(200).json(ret);
})

app.post('/api/getPosts', async (req, res, next) => {
  var error = '';
  var result = null;

  const { questionId } = req.body;

  try
  {
    const db = client.db('COP4331_LargeProject');
    result = await db.collection('Post').find({QuestionId:questionId}).toArray();
  }
  catch(e)
  {
    error = e.toString();
  }
  
  var ret = { postList: result, error: error }
  res.status(200).json(ret);
})

app.get('/api/posts/:slug', async (req, res, next) => 
{
  // incoming: Slug
  // outgoing: Markdown post
	
  var error = '';

  const slug = req.params.slug;

  const db = client.db('COP4331_LargeProject');
  const results = await db.collection('Post').find({Slug:slug}).toArray();

  var content = '';

  if( results.length > 0 )
  {
    content = results[0].Content;
  }

  var ret = { Content:content, error:error};
  res.status(200).json(ret);
});

// Returns list of posts associated with given user ID
app.get('/api/users/:UserId', async (req, res, next) => {

  var error = '';
  var postsList = [];

  const userId = req.params.UserId;

  try {
    const db = client.db('COP4331_LargeProject');
    const posts = db.collection("Post");

    const query = { UserId: userId };

    postsList = await posts.find(query).toArray();


  }
  catch (e) {
    error = e.toString();
  }

  var ret = { list: postsList, error: error };
  res.status(200).json(ret);

});

// Returns one random question
app.get('/api/questions/getRandom', async (req, res, next) => {

  var error = '';
  var randomQuestion;

  try {
    const db = client.db('COP4331_LargeProject');
    const questions = db.collection("Questions");

    const query =  [{ $sample: { size: 1 } }];

    randomQuestion = await questions.aggregate(query).next();


  }
  catch (e) {
    error = e.toString();
  }

  var ret = { question: randomQuestion, error: error };
  res.status(200).json(ret);

});

// Returns paginated list of questions based on current page and number of questions per page
app.post('/api/questions/:pageNum', async (req, res, next) => {

  var error = '';
  var questionList = [];

  const { questionPerPage } = req.body;

  const pageNum = parseInt(req.params.pageNum);

  try {
    const db = client.db('COP4331_LargeProject');
    const questions = db.collection("Questions");

    const toSkip = (pageNum - 1) * questionPerPage ;

    questionList = await questions.find().skip(toSkip).limit(questionPerPage).toArray();

  }
  catch (e) {
    error = e.toString();
  }

  var ret = { question: questionList, error: error };
  res.status(200).json(ret);

});