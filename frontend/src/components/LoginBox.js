import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Login from './Login';
import Register from './Register';

export default function LoginBox() {

    return (
        <>
            <Container>
                <Row className="justify-content-center mt-5">
                    <Col id="LoginDiv" style={{
                    backgroundColor: '#1A1A20', height: '50vh',
                    borderRadius: '15px 0px 0px 15px', textAlign: 'center',
                    padding: '5vh', boxShadow: "10px 10px"
                    }}>
                        <Login />
                    </Col>
                    <Col id="RegisterDiv" style={{
                    backgroundColor: '#31ABEE', height: '50vh',
                    borderRadius: '0px 15px 15px 0px',
                    textAlign: 'center', padding: '5vh', boxShadow: "10px 10px"
                    }}>
                        <Register />
                    </Col>
                </Row>
            </Container>
        </>
    )

}
