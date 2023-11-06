import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function GlobalNavbar() {

    return (
        <Navbar expand="lg" bg="dark" data-bs-theme="dark">
            <Container>
                <Nav className="me-auto">
                    <Nav.Link href="/home">Home</Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link href="/home">Log Out</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}
