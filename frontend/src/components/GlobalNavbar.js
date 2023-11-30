import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { PersonCircle } from 'react-bootstrap-icons';
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

        localStorage.removeItem("stance");
        localStorage.removeItem("user_data");
        localStorage.removeItem("token");

    }

    return (
        <Navbar expand="lg" bg="dark">
            <Container>
                <Navbar.Brand className="me-auto">
                    <Nav.Link href="/home/">Home</Nav.Link>
                </Navbar.Brand>
                <Nav>
                <NavDropdown title={ <PersonCircle size={36}></PersonCircle> } id="navbarScrollingDropdown">
                   <NavDropdown.Item href={ '/user/' + JSON.parse(localStorage.getItem("user_data")).id }>
                     Profile
                   </NavDropdown.Item>
                   <NavDropdown.Divider />
                   <NavDropdown.Item href="/" onClick={logOut}>
                     Logout
                   </NavDropdown.Item>
                </NavDropdown>
                </Nav>
            </Container>
        </Navbar>
    );
}
