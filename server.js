require('dotenv').config();
const url = process.env.MONGODB_URI;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect();

const ObjectId = require('mongodb').ObjectId;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const nodemailer = require("nodemailer");

const path = require('path');           
const Mailgen = require('mailgen');
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const bcrypt = require('bcrypt');

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

  var objId = new ObjectId(userId);

  let jwtSecretKey = process.env.JWT_SECRET_KEY; 
  let data = { 
      time: Date(), 
      userId: objId
  } 

  const token = jwt.sign(data, jwtSecretKey, { expiresIn: "24h" }); 

  ret = { token: token };

  res.status(200).json(ret);
});


app.post("/api/validateToken", (req, res) => { 

  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY; 
  let jwtSecretKey = process.env.JWT_SECRET_KEY; 

  const { userId } = req.body;

  try { 
      const token = req.header(tokenHeaderKey); 

      const verified = jwt.verify(token, jwtSecretKey); 
      if (verified){ 
          if (verified.userId === userId){
            return res.status(200).send({ "message": "Successfully Verified"}); 
          }
          else {
            return res.status(401).send({ "error": "userId does not match"} );
          }
      }
      else {  
          return res.status(401).send({ "error": "token was not verified, or token has expired" }); 
      } 
  } catch (error) { 
      return res.status(401).send(error); 
  } 
});

// in progress Email verification
app.post('/api/registerWithEmail', async (req, res, next) =>
{
  console.log(EMAIL);
  console.log(PASSWORD);

  const { email, userId } = req.body;

  objId = new ObjectId(userId);

  let jwtSecretKey = process.env.JWT_SECRET_KEY; 
  let data = { 
      time: Date(), 
      userId: objId
  } 

  const token = jwt.sign(data, jwtSecretKey, { expiresIn: "1h" }); 

  const newRequest = { userId, token };

  var error = '';

  try
  {
    const db = client.db('COP4331_LargeProject');
    const result = db.collection('EmailVerificationRequests').insertOne(newRequest);
  }
  catch(e)
  {
    error = e.toString();
    return res.status(500).json({ error })
  }

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
      link: 'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com'
    }
  })

  let response = {
      body: {
        intro: 'Welcome to FightOrFlight! We\'re very excited to have you on board.',
        action: {
            instructions: 'To get started, please click here:',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'Confirm your account',
                link: 'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com/emailverified/' + token
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
  }

  let mail = MailGenerator.generate(response)

  let message = {
    from : EMAIL,
    to: email,
    subject: "Registration",
    html: mail
  }
  transporter.sendMail(message).then(() => {
    return res.status(201).json({
      msg: "you should recieve an email",
      token: token
    })
  }).catch(error => {
    return res.status(500).json({ error })
  })


});

// email verification for forgot password
app.post('/api/forgotPassword', async (req, res, next) =>
{
  const { userId, email } = req.body;

  objId = new ObjectId(userId);

  let jwtSecretKey = process.env.JWT_SECRET_KEY; 
  let data = { 
      time: Date(), 
      userId: objId
  } 

  const token = jwt.sign(data, jwtSecretKey, { expiresIn: "1h" }); 

  const newRequest = { userId, token };
  var error = '';

  try
  {
    const db = client.db('COP4331_LargeProject');
    const result = db.collection('PassChangeRequests').insertOne(newRequest);
  }
  catch(e)
  {
    error = e.toString();
    return res.status(500).json({ error })
  }

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
      link: 'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com'
    }
  })

  let response = {
      body: {
        intro: 'Welcome back to FightOrFlight! You have requested a password reset for your account.',
        action: {
            instructions: 'To get started, please click here:',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'Change password',
                link: 'https://fight-or-flight-20k-5991cb1c14ef.herokuapp.com/changepassword/'
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
  }

  let mail = MailGenerator.generate(response)

  let message = {
    from : EMAIL,
    to: email,
    subject: "Forgot Password",
    html: mail
  }
  transporter.sendMail(message).then(() => {
    return res.status(201).json({
      msg: "you should recieve an email",
      token: token
    })
  }).catch(error => {
    return res.status(500).json({ error })
  })


});

app.post('/api/changePassword', async (req, res, next) => {

  var error = '';
  const { userId, newPassword } = req.body;
  var userObjId = null;
  var user = null;
  
  try {
    userObjId = new ObjectId(userId);
    const db = client.db('COP4331_LargeProject');
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    db.collection('Users').updateOne( { _id:userObjId },
    {
      $set: {
        Password: hashPassword
      }
    })
    const deleted = db.collection('PassChangeRequests').deleteOne({userId: userId});
  }
  catch (e) {
    error = e.toString();
  }

  var ret = { newPassword: newPassword, error: error };
  res.status(200).json(ret);

});

app.post('/api/changeEmail', async (req, res, next) => {

  var error = '';
  const { userId, email } = req.body;
  var objId = new ObjectId(userId);
  try {
    const db = client.db('COP4331_LargeProject');
    db.collection('Users').updateOne( { _id:objId },
    {
      $set: {
        Email: email
      }
    })
  }
  catch (e) {
    error = e.toString();
  }

  var ret = { newEmail: email, error: error };
  res.status(200).json(ret);

});

// Invoked once user clicks on email link, verifies email and deletes request object
app.post('/api/grabUserByEmailVerificationRequest', async (req, res, next) => {
  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY; 
  let jwtSecretKey = process.env.JWT_SECRET_KEY; 

  var error = '';
  const { token } = req.body;

  var id = -1;
  var result = {};

  try
  {
    const verified = jwt.verify(token, jwtSecretKey);

    if (!verified)
    {
      error = "Token not valid"
      return res.status(401).send(error); 
    }
  }
  catch (e)
  {
    return res.status(401).send(e);
  }

  try 
  {
    const query = {token: token};
    const db = client.db('COP4331_LargeProject');
    result = await db.collection('EmailVerificationRequests').findOne(query);
    const deleted = await db.collection('EmailVerificationRequests').deleteOne(query);
  }
  catch (e)
  {
    error = e.toString();
  }

  if(result)
  {
    id = result.userId;
  }

  var ret = { userId: id, error: error };
  res.status(200).json(ret);
})

app.post('/api/makeUserRegistered', async (req, res, next) => {
  var error = '';
  const { userId } = req.body;

  var objId = new ObjectId(userId);
  
  try {
    const db = client.db('COP4331_LargeProject');
    db.collection('Users').updateOne( { _id:objId },
    {
      $set: {
        Registered: true
      }
    })
  }
  catch (e) {
    error = e.toString();
  }

  var ret = { error: error };
  res.status(200).json(ret);
})

// Invoked when user clicks on email link, deletes password change request oject
app.post('/api/grabUserByPassRequest', async (req, res, next) => {

  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY; 
  let jwtSecretKey = process.env.JWT_SECRET_KEY; 

  var error = '';
  const { token } = req.body;

  var id = -1;
  var result = {};

  try
  {
    const verified = jwt.verify(token, jwtSecretKey);

    if (!verified)
    {
      error = "Token not valid"
      const deleted = db.collection('PassChangeRequests').deleteOne({ token: token });
      return res.status(401).send(error); 
    }
  }
  catch (e)
  {
    return res.status(401).send(e);
  }

  try 
  {
    const query = { token: token };
    const db = client.db('COP4331_LargeProject');
    result = await db.collection('PassChangeRequests').findOne(query);
  }
  catch (e)
  {
    error = e.toString();
  }

  if( result)
  {
    id = result.userId;
  }
  
  var ret = { userId: id, error: error };
  res.status(200).json(ret);
})

app.post('/api/register', async (req, res, next) =>
{
	
  const { username, password, email } = req.body;
  var error = '';
  var result = null;
  var id = '';

  const db = client.db('COP4331_LargeProject');
  try
  {
    const results = await db.collection('Users').find({Username:username}).toArray();
    if (results.length > 0)
    {
      error = 'Username already taken';
    }
    else
    {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const newUser = {Username:username, Password:hashPassword, Email:email, Answers:[]};
      const db = client.db('COP4331_LargeProject');
      result = await db.collection('Users').insertOne(newUser);
      if (result != null)
        id = result.insertedId.toString();
    }
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = { userId: id, error: error };
  res.status(200).json(ret);
});

app.post('/api/login', async (req, res, next) => 
{
	
 var error = '';

  const { login, password } = req.body;

  const db = client.db('COP4331_LargeProject');
  try
  {
    const results = await db.collection('Users').find({Username:login}).toArray();

    var id = -1;

    if( results.length > 0 )
    {
      const compare = await bcrypt.compare(password, results[0].Password)
      if (compare)
      {
        if (results[0].Registered == true)
          id = results[0]._id;
        else
          error = 'This user is not email registered!';
      }
      else
      {
        error = 'Incorrect password!';
      }
    }
    else
    {
      error = 'No user with that username found!';
    }
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = { id:id, error:error};
  res.status(200).json(ret);
});

app.post('/api/getUserByEmail', async (req, res, next) => 
{
	
 var error = '';

  const { email } = req.body;

  const db = client.db('COP4331_LargeProject');
  const results = await db.collection('Users').find({Email:email}).toArray();

  var id = -1;

  if( results.length > 0 )
  {
    id = results[0]._id;
  }

  var ret = { id:id, error:''};
  res.status(200).json(ret);
});

app.post('/api/getUserByUserId', async (req, res, next) => 
{
	
  var error = '';
  var results;
  const { userId } = req.body;
  const userObjID = new ObjectId(userId);
  try
  {
    const db = client.db('COP4331_LargeProject');
    results = await db.collection('Users').findOne({_id:userObjID});
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = { results: results, error:error};
  res.status(200).json(ret);
});

// Returns number of questions
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

// Returns number of posts for given question slug and stance conditions (fight or flight)
app.post('/api/numPosts', async (req, res, next) => {

  var result = 0;
  var error = '';

  const { questionSlug, stance, response} = req.body;

  try {

    const fightQuery = {
      $and: [
        { "QuestionSlug": { $exists: true } },
        { "QuestionSlug": questionSlug },
        { "Answer.stance": "fight" }
      ]
    };

    const flightQuery = {
      $and: [
        { "QuestionSlug": { $exists: true } },
        { "QuestionSlug": questionSlug },
        { 'Answer.stance': 'flight' },
        { 'Answer.response': response }
      ]
    }

    const db = client.db('COP4331_LargeProject');
    const posts = db.collection("Post");

    if(stance === "fight")
      result = await posts.countDocuments(fightQuery); 
    else if (stance === "flight")
      result = await posts.countDocuments(flightQuery);

  }
  catch (e) {
    error = e.toString();
  }

  var ret = { numPosts: result, error: error };
  res.status(200).json(ret);
});

// Adds new post to collection
app.post('/api/addPost', async (req, res, next) => {
  
  var error = '';
  var answer = null;
  var timestamp = new Date(Date.now());
  var numReplies = 0;
  var username = '';
  const { userId, slug, content, title, questionSlug, answerId } = req.body;

  const answerObjId = new ObjectId(answerId);
  const userObjID = new ObjectId(userId);
  try
  {
    const db = client.db('COP4331_LargeProject');
    answer = await db.collection('Answer').findOne({ _id:answerObjId });
    numReplies = await db.collection('Replies').countDocuments({ slug:slug });
    const results = await db.collection('Users').find({ _id:userObjID }).toArray();
    if( results.length > 0 )
    {
      username = results[0].Username;
    }
  }
  catch (e)
  {
    error = e.toString();
  }

  const newPost = { UserId:userId, Username:username, numReplies:numReplies, Timestamp:timestamp, Slug:slug, Content:content, Title:title, QuestionSlug:questionSlug, Answer:answer}

  // check if slug exists in database. If it does, append an incrementing number ex: i-dont-like-cats_1
  try 
  {
    const db = client.db('COP4331_LargeProject');
    var result = await db.collection('Post').countDocuments({Slug:slug});
    if ( result == 0 )
    {
      const result = db.collection('Post').insertOne(newPost);
    }
    else
    {
      var append = 1;
      var newSlug = slug + "_" + append;
      result = await db.collection('Post').countDocuments({Slug:newSlug});
      // hard cap of numbered entries is 20 for now
      while ((result >= 1) || append > 20)
      {
        append++;
        newSlug = slug + "_" + append;
        result = await db.collection('Post').countDocuments({Slug:newSlug});
      }
      const appendedPost = { UserId:userId, Username:username, numReplies:numReplies, Timestamp:timestamp, Slug:newSlug, Content:content, Title:title, QuestionSlug:questionSlug, Answer:answer}
      const appendedResult = db.collection('Post').insertOne(appendedPost);
    }

  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = { error:error};
  res.status(200).json(ret);
});

// Returns list of all posts associated with question
app.post('/api/getPosts', async (req, res, next) => {
  var error = '';
  var result = null;

  const { questionSlug, stance, response } = req.body;

  try
  {
    const db = client.db('COP4331_LargeProject');
    if (stance === "fight") {
      result = await db.collection('Post').find({ 
        $and: [ { QuestionSlug: questionSlug }, { 'Answer.stance': 'fight' } ]
       }).toArray();
    }
    else if (stance === "flight") {
      result = await db.collection('Post').find({
        $and: [ { QuestionSlug: questionSlug }, { 'Answer.stance': 'flight' }, { 'Answer.response': response } ]
      }).toArray();
    }
  }
  catch(e)
  {
    error = e.toString();
  }
  
  var ret = { postList: result, error: error }
  res.status(200).json(ret);
})

// Returns title and markdown content associated with post slug
app.get('/api/posts/:slug', async (req, res, next) => 
{
  // incoming: Slug
  // outgoing: Title + Markdown content
	
  var error = '';

  const slug = req.params.slug;

  const db = client.db('COP4331_LargeProject');
  const result = await db.collection('Post').find({Slug:slug}).next();

  var ret = { Result:result, error:error};
  res.status(200).json(ret);
});

// Returns paginated list of posts associated with given user ID
app.post('/api/posts/getPostsByUser/:pageNum', async (req, res, next) => {

  var error = '';
  var postsList = [];

  const { userId, postsPerPage } = req.body;

  const pageNum = parseInt(req.params.pageNum); 

  try {

    const query = {
      $and: [
        { "UserId": { $exists: true } },
        { "UserId": userId }
      ]
    };

    const db = client.db('COP4331_LargeProject');
    const posts = db.collection("Post");

    const toSkip = (pageNum - 1) * parseInt(postsPerPage);

    postsList = await posts.find(query).skip(toSkip).limit(parseInt(postsPerPage)).toArray();


  }
  catch (e) {
    error = e.toString();
  }

  var ret = { list: postsList, error: error };
  res.status(200).json(ret);

});

// Counts  number of posts from given user
app.post('/api/posts/countPostsByUser', async (req, res, next) => {

  var error = '';
  var count = 0;
  const {UserId} = req.body;


  try{
    const query = {
      $and: [
        { "UserId": { $exists: true } },
        { "UserId": UserId }
      ]
    };

    const db = client.db('COP4331_LargeProject');
    const posts = db.collection("Post");

    count = await posts.countDocuments(query);
  }
  catch (e) {
    error = e.toString();
  }

  var ret = { postsCount: count, error: error };
  res.status(200).json(ret);
});

app.get('/api/questions/getQuestion/:slug', async (req, res, next) => {
  
  var error = '';

  const slug = req.params.slug;
  var question = null;

  try {
    const db = client.db('COP4331_LargeProject');
    const questions = db.collection("Questions");

    const query = {slug: slug};

    question = await questions.findOne(query);
  }
  catch (e) {
    error = e.toString();
  }

  var ret = { question: question, error: error };
  res.status(200).json(ret);
})

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


// Returns paginated list of posts associated with question
app.post('/api/getPostsByQuestion/:pageNum', async (req, res, next) => {

  var error = '';
  var postList = [];

  const { questionSlug, stance, response, postsPerPage } = req.body;

  const pageNum = parseInt(req.params.pageNum);

  try {

    const fightQuery = {
      $and: [
        { "QuestionSlug": { $exists: true } },
        { "QuestionSlug": questionSlug },
        { "Answer.stance": "fight" }
      ]
    };

    const flightQuery = {
      $and: [
        { "QuestionSlug": { $exists: true } },
        { "QuestionSlug": questionSlug },
        { 'Answer.stance': 'flight' }, 
        { 'Answer.response': response }
      ]
    }

    const db = client.db('COP4331_LargeProject');
    const posts = db.collection("Post");

    const toSkip = (pageNum - 1) * postsPerPage;

    if (stance === "fight")
    {
      postList = await posts.find(fightQuery).skip(toSkip).limit(parseInt(postsPerPage)).toArray();
    }
    else if (stance === "flight")
    {
      postList = await posts.find(flightQuery).skip(toSkip).limit(parseInt(postsPerPage)).toArray();
    }
  }
  catch (e) {
    error = e.toString();
  }

  var ret = { posts: postList, error: error };
  res.status(200).json(ret);

});

// returns all replies by UserID. Also sends back the textList and slugList individually sorted by their index.
app.post('/api/replies/grabRepliesbyUserID', async (req, res, next) => {

  var error = '';
  var replyList = [];
  var textList = [];
  var slugList = [];

  const { userID } = req.body;

  try {
    const db = client.db('COP4331_LargeProject');
    replyList = await db.collection('Replies').find({UserID:userID}).toArray();

    for (i = 0; i < replyList.length; i++)
    {
      textList[i] = replyList[i].text;
      slugList[i] = replyList[i].slug;
    }
  }
  catch (e) {
    error = e.toString();
  }
  var ret = { fullList: replyList, textList:textList, slugList:slugList, error:''};
  res.status(200).json(ret);
});

// WIP (assuming database has unique slugs) returns an array of replies and an array of their associated posts
// UPDATE: Only retrieves one post per reply and is now paginated
app.post('/api/replies/grabRepliesAndPostsByUserId/:pageNum', async (req, res, next) => {

  var error = '';
  var replyList = [];
  var pairList = [];

  const { userId, perPage } = req.body;

  const pageNum = parseInt(req.params.pageNum); 

  const toSkip = (pageNum - 1) * perPage;


  try {
    const db = client.db('COP4331_LargeProject');
    replyList = await db.collection('Replies').find({ userId: userId }).skip(toSkip).limit(perPage).toArray();

    pairList = await Promise.all(replyList.map(async (reply) => {
        return {post: await db.collection('Post').findOne({Slug:reply.slug}), reply: reply};
    }))
  }
  catch (e) {
    error = e.toString();
  }

  var ret = { pairList: pairList, error:''};
  res.status(200).json(ret);
});

// Returns paginated list of replies by UserID. 
app.post('/api/replies/getRepliesByUserID/:pageNum', async (req, res, next) => {

  var error = '';
  var replyList = [];

  const { UserID , repliesPerPage} = req.body;

  const pageNum = parseInt(req.params.pageNum);

  try {

    const query = {
      $and: [
        { "UserID": { $exists: true } },
        { "UserID": UserID }
      ]
    };

    const db = client.db('COP4331_LargeProject');
    const replies = db.collection('Replies');

    const toSkip = (pageNum - 1) * parseInt(repliesPerPage);
    
    replyList = await replies.find(query).skip(toSkip).limit(parseInt(repliesPerPage)).toArray();

  }
  catch (e) {
    error = e.toString();
  }
  var ret = { list: replyList, error: '' };
  res.status(200).json(ret);
});

// Counts  number of replies from given user
app.post('/api/replies/countRepliesByUser', async (req, res, next) => {

  var error = '';
  var count = 0;
  const { UserId } = req.body;


  try {

    const query = {
      $and: [
        { "userId": { $exists: true } },
        { "userId": UserId }
      ]
    };

    const db = client.db('COP4331_LargeProject');
    const replies = db.collection("Replies");

    count = await replies.countDocuments(query);
  }
  catch (e) {
    error = e.toString();
  }

  var ret = { repliesCount: count, error: error };
  res.status(200).json(ret);
});

// Adds new reply to collection
app.post('/api/addReply', async (req, res, next) => {
  
  var error = '';

  const { userId, text, slug, response } = req.body;

  const date = new Date(Date.now());
  const userObjId = new ObjectId(userId);

  const newReply = { userId:userId, text:text, slug:slug, timestamp:date, response:response }

  try 
  {
    const db = client.db('COP4331_LargeProject');

    const user = await db.collection('Users').findOne({ _id: userObjId });
    newReply.username = user.Username;

    const result = db.collection('Replies').insertOne(newReply);
  }
  catch(e)
  {
    console.log(e);

    error = e.toString();
  }

  var ret = { error:error};
  res.status(200).json(ret);
});

// Returns list of all replies associated with slug
app.post('/api/replies/getByPostSlug', async (req, res, next) => {
  var error = '';
  var result = null;

  const { slug } = req.body;

  try
  {
    const db = client.db('COP4331_LargeProject');
    result = await db.collection('Replies').find({ slug: slug}).toArray();
  }
  catch(e)
  {
    error = e.toString();
  }
  
  var ret = { replyList: result, error: error }
  res.status(200).json(ret);
})

// Adds an answer to the database
app.post('/api/answers/addAnswer', async(req, res, next) => {
  var error = '';
  var addResult = null;
  var insertedId = null;

  const obj = { response, stance, questionId, userId } = req.body;

  if (userId != '') {
    var userObjId = new ObjectId(userId);
  }
  else {
    error = "User ID not received!";
    var ret = { error:error }; 
  }

  if (questionId != '') {
    var questionObjId = new ObjectId(questionId);
  }
  else {
    error = "Question ID not received!";
    var ret = { error:error };
  }

  const newAnswer = { response, stance, question: questionObjId, user: userObjId }

  try {
    const db = client.db('COP4331_LargeProject');
    addResult = await db.collection('Answer').insertOne(newAnswer);
    const updResult = await db.collection('Users').updateOne( { _id:userObjId }, {
      $push: { Answers: questionObjId }
    })
  }
  catch(e) {
    error = e.toString();
  }

  console.log(addResult.insertedId.toString());

  var ret = { answerId: addResult.insertedId.toString(), error: error }
  res.status(200).json(ret);
})

app.post('/api/answers/getUserAnswer', async (req, res, next) => {
  var error = '';
  var result = null;

  const { userId, questionId } = req.body;

  var userObjId = new ObjectId(userId);
  var questionObjId = new ObjectId(questionId);

  try {
    const db = client.db('COP4331_LargeProject');
    result = await db.collection('Answer').findOne({ question: questionObjId, user: userObjId })
  }
  catch (e) {
    error = e.toString();
  }

  var ret = { answer: result, error: error };
  res.status(200).json(ret);
})

app.post('/api/users/getAnsweredQuestions', async (req, res, next) => {
  var error = '';
  var result = null;
  var questionIds = null;

  const { userId } = req.body;

  var userObjId = new ObjectId(userId);

  try {
    const db = client.db('COP4331_LargeProject');
    result = await db.collection('Users').findOne({ _id: userObjId });
    questionIds = result.Answers;
  }
  catch (e) {
    error = e.toString();
  }

  var ret = { questionIds: questionIds };
  res.status(200).json(ret);
})

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