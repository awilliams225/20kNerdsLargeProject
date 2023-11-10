import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton'
import ButtonGroup from 'react-bootstrap/ToggleButtonGroup'


export default function ChooseAnswer() {
    const [active, setActive] = useState("");
    const [checked, setChecked] = useState(false);
    const [radioValue, setRadioValue] = useState('');

    return (
        <Container fluid style={{ backgroundColor: '#CDD1D5', height: '50vh' }}>
            <ButtonGroup name="options" type="radio">
                <ToggleButton className="d-flex align-items-center justify-content-center"
                    style={{
                        height: '40vh', width: '52vw', borderRadius: '0',
                        marginLeft: '-5vw', position: 'relative', zIndex:'0'
                    }}
                    key={1}
                    id={"radio-1"}
                    type="radio"
                    //variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                    name="radio"
                    value={1}
                    checked={radioValue === 1}
                    onChange={(e) => setRadioValue(e.currentTarget.value)}
                >
                    Cats!
                </ToggleButton>
                <ToggleButton className="d-flex align-items-center justify-content-center"
                    style={{
                        height: '40vh', width: '52vw', borderRadius: '0',
                        marginRight: '-15vw', position: 'relative', zIndex:'0'
                    }}
                    key={2}
                    id={"radio-2"}
                    type="radio"
                    //variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                    name="radio"
                    value={2}
                    checked={radioValue === 2}
                    onChange={(e) => setRadioValue(e.currentTarget.value)}
                >
                    Dogs!
                </ToggleButton>
            </ButtonGroup>
            <Row className="d-flex align-items-center justify-content-center">
                <div className="d-flex align-items-center justify-content-center"
                    style={{
                        backgroundColor: 'white', width: '60vw',
                        borderRadius: '15px', textAlign: 'center', height: '10vh', marginTop: '-60vh',
                        position: 'absolute'
                    }}>
                    <h3>Cats or Dogs?</h3>
                </div>
            </Row>
            <Row>
                <Col className="d-flex align-items-center justify-content-end">
                    <Button style={{
                        width: '75%', height: '10vh', marginRight: '-4vw',
                        borderRadius: 0
                    }} variant='light'>
                        Cancel
                    </Button>
                </Col>
                <Col className="d-flex align-items-center justify-content-center">
                    <Button style={{ width: '40vw', height: '10vh', borderRadius: 0 }}
                        variant="dark"
                        key={3}
                        //className={(active != "1" || active != "2") ? "active" : undefined}
                        id={"3"}
                        active={radioValue === ''}
                    >
                        Submit
                    </Button>
                </Col>
                <Col className="d-flex align-items-center justify-content-start">
                    <Button style={{
                        width: '75%', height: '10vh', marginLeft: '-4vw',
                        borderRadius: 0
                    }} variant='light'>
                        FLIGHT MODE
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}
