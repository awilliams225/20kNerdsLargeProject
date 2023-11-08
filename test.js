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

describe("Token", () => {

    it('Should create a token', (done) => {
        let obj = {
            "userId": 12
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
            .get('/api/validateToken')
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
            .get('/api/validateToken')
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
            "userId": 12
        }
        chai.request(app)
            .post('/api/generateToken')
            .send(obj)
            .then((res) => {
                var token = res.body.token;
                chai.request(app)
                .get('/api/validateToken')
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
    it("Should return the number of questions", () => {
        chai.request(app)
            .post('/api/numQuestions')
            .then((res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res.should.have.property('numQuestions');
                done();
            })
    })

    it("It should return a random question", () => {
        chai.request(app)
            .get('/api/questions/gerRandom')
            .then((res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res.shoud.have.property('question', object);
                done();
            })
    })
})