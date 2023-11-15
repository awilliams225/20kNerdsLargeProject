import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';
export default function GlobalNavbar() {

    const app_name = 'fight-or-flight-20k-5991cb1c14ef'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:3000/' + route;
        }
    }

    const logOut = () => {

        localStorage.removeItem("user_data");
        localStorage.removeItem("token");

    }

    return (
        <Navbar expand="lg" bg="dark" data-bs-theme="dark">
            <Container>
                <Nav className="me-auto">
                    <Nav.Link href="/home/">Home</Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link href='/' onClick={logOut}>Log Out</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}
