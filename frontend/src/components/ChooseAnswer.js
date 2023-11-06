import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function ChooseAnswer() {
    return (
        <Container fluid style={{backgroundColor:'#CDD1D5', height: '50vh'}}>
            <Row style={{ textAlign: 'center' }}>
                <Col className="d-flex align-items-center justify-content-center"
                     style={{height:'40vh'}}>
                    <Button style={{height:'100%', width:'50vw', borderRadius:'0',
                            marginLeft:'-5vw', marginRight:'-5vw'}}>
                        Cats!
                    </Button>
                </Col>
                <Col className="d-flex align-items-center justify-content-center"
                     style={{height:'40vh'}}>
                    <Button style={{height:'100%', width:'50vw', borderRadius:'0',
                            marginRight:'-5vw', marginLeft:'-5vw'}}>
                        Dogs!
                    </Button>
                </Col>
            </Row>
            <Row className="d-flex align-items-center justify-content-center">
                <div className="d-flex align-items-center justify-content-center"
                    style={{
                        backgroundColor: 'white', width: '60vw',
                        borderRadius: '15px', textAlign: 'center', height:'60%', marginTop:'-70vh'
                    }}>
                    <h3>Cats or Dogs?</h3>
                </div>
            </Row>
            <Row>
                <Col className="d-flex align-items-center justify-content-end">
                    <Button style={{width:'75%', height:'10vh', marginRight:'-4vw',
                            borderRadius:0}} variant='light'>
                        Cancel
                    </Button>
                </Col>
                <Col className="d-flex align-items-center justify-content-center">
                    <Button style={{width:'40vw', height:'10vh', borderRadius:0}} variant="dark">
                        Submit
                    </Button>
                </Col>
                <Col className="d-flex align-items-center justify-content-start">
                    <Button style={{width:'75%', height:'10vh', marginLeft:'-4vw',
                            borderRadius:0}} variant='light'>
                        FLIGHT MODE
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}
