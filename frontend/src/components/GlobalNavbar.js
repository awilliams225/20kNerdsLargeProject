import React, { useEffect, useState, useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { PersonCircle } from 'react-bootstrap-icons';
import LoginTitle from './LoginTitle';
import { StanceContext } from './StanceContext';

export default function GlobalNavbar() {

    const [username, setUsername] = useState();
    const [userLoading, setUserLoading] = useState(true);
    const {stance, setStance} = useContext(StanceContext);

    const app_name = 'fight-or-flight-20k-5991cb1c14ef'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }

    useEffect(() => {
        const getUser = async () => {
            setUserLoading(true);

            const userId = JSON.parse(localStorage.getItem('user_data')).id;

            const obj = { userId };
            const js = JSON.stringify(obj);

            const response = await fetch(buildPath("api/getUserByUserId"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (response.status === 200) {
                const json = JSON.parse(await response.text());

                setUsername(json.results.Username);

                setUserLoading(false);
            }
            else {
                console.log("Could not find user!");
            }
        }

        getUser()
    }, [])

    const logOut = () => {

        localStorage.removeItem("stance");
        localStorage.removeItem("user_data");
        localStorage.removeItem("token");

    }

    const renderNavbar = () => {
        if (userLoading) {
            return (
                <>
                </>
            )
        }
        else {
            return (
                <Navbar expand="lg" bg={`dark-${stance}`}>
                    <Container>
                        <Navbar.Brand className="me-auto">
                            <Nav.Link href="/home/">
                                <LoginTitle height='10vh' />
                            </Nav.Link>
                        </Navbar.Brand>
                        <Nav>
                        <NavDropdown title={ <div><PersonCircle size={36}></PersonCircle> &nbsp; {username}</div> } id="navbarScrollingDropdown">
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
    }

    return (
        <>
            <div>
                {renderNavbar()}
            </div>
        </>
    );
}
