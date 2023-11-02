// Import the dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./server');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Login", () => {
    it('Should deliver userId based on credentials'), (done) => {
        let user = {
            "login": "RickL",
            "password": "COP4331"
        }
        chai.request(app)
            .post('/api/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('error');
            done();
            })
            
    }
})