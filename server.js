require('dotenv').config();
const url = process.env.MONGODB_URI;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const nodemailer = require("nodemailer");

const path = require('path');           
const Mailgen = require('mailgen');
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

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

app.post("/api/generateToken", (req, res) => { 

  const { userId } = req.body;

  let jwtSecretKey = process.env.JWT_SECRET_KEY; 
  let data = { 
      time: Date(), 
      userId: userId
  } 

  const token = jwt.sign(data, jwtSecretKey); 

  ret = { token: token };

  res.status(200).json(ret);
});


app.get("/api/validateToken", (req, res) => { 

  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY; 
  let jwtSecretKey = process.env.JWT_SECRET_KEY; 

  try { 
      const token = req.header(tokenHeaderKey); 

      const verified = jwt.verify(token, jwtSecretKey); 
      if(verified){ 
          return res.send({ "message": "Successfully Verified"}); 
      }else{ 
          return res.status(401).send(error); 
      } 
  } catch (error) { 
      return res.status(401).send(error); 
  } 
});

// in progress Email verification
app.post('/api/registerWithEmail', async (req, res, next) =>
{
  const { firstName, lastName, username, password, userEmail } = req.body;
	let config = {
    service : 'gmail',
    auth : {
      user: EMAIL,
      pass: PASSWORD
    }
  }

  let transporter = nodemailer.createTransport(config);
  let MailGenerator = new Mailgen({
    theme: "default",
    product : {
      name: "FightOrFlight",
      link: 'http://localhost:3000/'
    }
  })

  let response = {
      body: {
        name: firstName + " " + lastName,
        intro: 'Welcome to FightOrFlight! We\'re very excited to have you on board.',
        action: {
            instructions: 'To get started, please click here:',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'Confirm your account',
                link: 'http://localhost:3000/'
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
  }

  let mail = MailGenerator.generate(response)

  let message = {
    from : EMAIL,
    to: userEmail,
    subject: "Registration",
    html: mail
  }
  transporter.sendMail(message).then(() => {
    return res.status(201).json({
      msg: "you should recieve an email"
    })
  }).catch(error => {
    return res.status(500).json({ error })
  })


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

// Returns number of posts associated with given question slug
app.post('/api/numPosts', async (req, res, next) => {

  var result = 0;
  var error = '';

  const { questionSlug } = req.body;

  try {
    const db = client.db('COP4331_LargeProject');
    result = await db.collection('Post').countDocuments({QuestionSlug: questionSlug});
  }
  catch (e) {
    error = e.toString();
  }

  var ret = { numPosts: result, error: error };
  res.status(200).json(ret);
});

app.post('/api/addPost', async (req, res, next) => {
  
  var error = '';

  const { userId, slug, content, title, questionSlug } = req.body;

  const newPost = { UserId:userId, Slug:slug, Content:content, Title:title, QuestionSlug:questionSlug, Comments: []}

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

  const { questionSlug } = req.body;

  try
  {
    const db = client.db('COP4331_LargeProject');
    result = await db.collection('Post').find({QuestionSlug:questionSlug}).toArray();
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

v

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

app.listen(PORT, () => 
{
  console.log('Server listening on port ' + PORT);
});

module.exports = app;