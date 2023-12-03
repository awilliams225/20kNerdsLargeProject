// Import the dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./server');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Login", () => {
    it('Should deliver userId based on credentials', (done) => {
        let user = {
            "login": "RickL",
            "password": "COP4331"
        }
        chai.request(app)
            .post('/api/login')
            .send(user)
            .then((res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('error');
                done();
            })
            .catch((err) => done(err));
        })

    it('Should register a new user', (done) => {
        let user = {
            "username": "testing123",
            "password": "password123"
        }
        chai.request(app)
            .post('/api/login')
            .send(user)
            .then((res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                done();
            })
            .catch((err) => done(err));
        })          
    })

describe("Token", () => {

    it('Should create a token', (done) => {
        let obj = {
            "userId": '655fe16f3f4d4e14d00f52ce'
        }
        chai.request(app)
            .post('/api/generateToken')
            .send(obj)
            .then((res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                done();
            })
            .catch((err) => done(err));
    })

    it('Should return error because token is invalid', (done) => {
        chai.request(app)
            .post('/api/validateToken')
            .set('twentythousand_header_key', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiU3VuIE5vdiAwNSAyMDIzIDE3OjAzOjE1IEdNVC0wNTAwIChFYXN0ZXJuIFN0YW5kYXJkIFRpbWUpIiwidXNlcklkIjoxMiwiaWF0IjoxNjk5MjIxNzk1fQ.aBWcvNi9tJpYJ-XS39w9HaPJa2r9d2wR207U41fPgJs')
            .then((res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('name', 'JsonWebTokenError');
                res.body.should.have.property('message', 'invalid signature');
                done();
            })
            .catch((err) => done(err));
    })

    it('Should return error because token is incorrect format', (done) => {
        chai.request(app)
            .post('/api/validateToken')
            .set('twentythousand_header_key', 'this header wont work')
            .then((res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('name', 'JsonWebTokenError');
                res.body.should.have.property('message', 'jwt malformed');
                done();
            })
            .catch((err) => done(err));
    })

    it('Should return that the token is valid', (done) => {
        let obj = {
            "userId": '655fe16f3f4d4e14d00f52ce'
        }
        chai.request(app)
            .post('/api/generateToken')
            .send(obj)
            .then((res) => {
                var token = res.body.token;
                chai.request(app)
                .post('/api/validateToken')
                .send(obj)
                .set('twentythousand_header_key', token)
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message', 'Successfully Verified');
                    done();
                })
                .catch((err) => done(err));
            })
            .catch((err) => done(err));
    })

})

describe("Questions", () => {
    it("Should return the number of questions", (done) => {
        chai.request(app)
            .post('/api/numQuestions')
            .then((res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res._body.should.have.property('numQuestions');
                done();
            })
            .catch((err) => done(err))
    })

    it("It should return a random question", (done) => {
        chai.request(app)
            .get('/api/questions/getRandom')
            .then((res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res._body.should.have.property('question');
                done();
            })
            .catch((err) => done(err))
    })

    it("It should return the first page of questions in 6-count pages", (done) => {
        let obj = {
            "questionPerPage": 6
        }
        chai.request(app)
            .post('/api/questions/1')
            .send(obj)
            .then((res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res._body.should.have.property('question').and.to.be.an('array');
                done();
            })
            .catch((err) => done(err))
    })
})

describe("Posts", () => {

    it("Should return the number of posts", (done) => {
        let obj = {
            "questionSlug": "cats_or_dogs",
            "stance": "fight",
            "response": 1
        }
        chai.request(app)
            .post('/api/numPosts')
            .send(obj)
            .then((res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res._body.should.have.property('numPosts').and.to.be.a('number');
                done();
            })
            .catch((err) => done(err))
    })

    it("Should get posts by stance and response", (done) => {
        let obj = {
            "questionSlug": "cats_or_dogs",
            "stance": "fight",
            "response": 1
        }
        chai.request(app)
            .post('/api/numPosts')
            .send(obj)
            .then((res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res._body.should.have.property('numPosts').and.to.be.a('number');
                done();
            })
            .catch((err) => done(err))
    })

    it("Should get a post's content by it's slug", (done) => {
        let postSlug = 'test_2';
        chai.request(app)
            .get('/api/posts/' + postSlug)
            .then((res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res._body.should.have.property('Result').and.to.be.a('object');
                done();
            })
            .catch((err) => done(err))
    })

    it("Should count all posts a user has", (done) => {
        let obj = {
            "userId": "655fe16f3f4d4e14d00f52ce"
        }
        chai.request(app)
            .post('/api/posts/countPostsByUser')
            .send(obj)
            .then((res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res._body.should.have.property('postsCount').and.to.be.a('number');
                done();
            })
            .catch((err) => done(err));
    })

    it("Should get a page of a user's posts", (done) => {
        let obj = {
            "userId": "655fe16f3f4d4e14d00f52ce",
            "postsPerPage": 6
        }
        chai.request(app)
            .post('/api/posts/getPostsByUser/' + 1)
            .then((res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res._body.should.have.property('list').and.to.be.an('array');
                done();
            })
            .catch((err) => done(err))
    })

})

describe("Replies", () => {
    it("Should get all replies under a post", (done) => {
        let obj = {
            "slug": "hello"
        }
        chai.request(app)
            .post('/api/replies/getByPostSlug')
            .send(obj)
            .then((res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res._body.should.have.property('replyList').and.to.be.an('array');
                done();
            })
            .catch((err) => done(err))
    })

    it("Should count all of a user's replies", (done) => {
        let obj = {
            "UserID": "655fe16f3f4d4e14d00f52ce"
        }
        chai.request(app)
            .post('/api/replies/countRepliesByUser')
            .send(obj)
            .then((res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res._body.should.have.property('repliesCount').and.to.be.a('number');
                done();
            })
            .catch((err) => done(err))
    })

    it("Should get all of a user's replies", (done) => {
        let obj = {
            "userID": "655fe16f3f4d4e14d00f52ce"
        }
        chai.request(app)
            .post('/api/replies/grabRepliesByUserID')
            .send(obj)
            .then((res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res._body.should.have.property('fullList').and.to.be.an('array');
                res._body.should.have.property('textList').and.to.be.an('array');
                res._body.should.have.property('slugList').and.to.be.an('array');
                done();
            })
            .catch((err) => done(err))
    })
})