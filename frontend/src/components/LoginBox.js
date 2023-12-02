import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Login from './Login';
import Register from './Register';

export default function LoginBox() {

    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <div id="LoginDiv" style={{
                    backgroundColor: '#1A1A20', height: '50vh', width: '25%',
                    borderRadius: '15px 0px 0px 15px', textAlign: 'center',
                    padding: '5vh', boxShadow: "10px 10px"
                    }}>
                        <Login />
                    </div>
                    <div id="RegisterDiv" style={{
                    backgroundColor: '#31ABEE', height: '50vh', width: '25%',
                    borderRadius: '0px 15px 15px 0px',
                    textAlign: 'center', padding: '5vh', boxShadow: "10px 10px"
                    }}>
                        <Register />
                    </div>
                </Row>
            </Container>
        </>
    )

}
