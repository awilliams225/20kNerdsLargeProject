import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


export default function CreateReplyForm(props) {

    const slug = props.slug;

    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        text: ''
    })

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value});
        console.log(formData);
    }

    const app_name = 'fight-or-flight-20k-5991cb1c14ef'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }

    const handleSubmit = async () => {

        let userData = localStorage.getItem('user_data');
        if (!userData) {
            return;
        }
        let userId = JSON.parse(userData).id;

        var obj = { userId: userId, text: formData.text, slug: slug };
        var js = JSON.stringify(obj);

        const response = await fetch(buildPath('api/addReply'), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

        if (response != null) {
            const json = await response.json();
        }
        else {
            console.log("Response is null");
        }
    }

    return (
        <>
            <Button variant="primary-fight" className="shadow" onClick={handleShow}>
                Reply
            </Button>
            <Modal show={show} data-bs-theme="fight">
                <Card>
                    <Card.Header>Send reply</Card.Header>
                    <Card.Body>
                        <Form className="m-3" onSubmit={handleSubmit}>
                            <Form.Group className="mb-5" controlId="formText">
                                <Form.Control required name="text" as="textarea" placeholder="Respond with something cool..." onChange={handleChange} />
                            </Form.Group>
                            <Button variant="warning-fight me-3" onClick={handleClose}>Cancel</Button>
                            <Button variant="primary-fight" type="submit">Reply</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Modal>
        </>
    )

}
