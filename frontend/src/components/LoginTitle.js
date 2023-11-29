import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import logo from '../images/logo.png';

export default function LoginTitle() {

    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <Image src={logo} roundedCircle style={{
                    width:"40%",
                    height:"40%"
                }} />
                </Row>
            </Container>
        </>
    )

}
