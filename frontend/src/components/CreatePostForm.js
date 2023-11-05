import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


export default function CreatePostForm() {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button onClick={handleShow}>
                Create Post
            </Button>
            <Modal show={show} onHide={handleClose} data-bs-theme="dark">
                <Card bg="dark">
                    <Card.Header>Create a Post</Card.Header>
                    <Card.Body>
                        <Form className="m-3">
                            <Form.Group className="mb-5" controlId="formPostTitle">
                                <Form.Label>Post Title</Form.Label>
                                <Form.Control type="text" placeholder="Write a witty title..." />
                            </Form.Group>
                            <Form.Group className="mb-5" controlId="formPostContent">
                                <Form.Label>Post Content</Form.Label>
                                <Form.Control as="textarea" placeholder="Explain your answer..." />
                            </Form.Group>
                            <Button variant="danger me-3" type="submit">Discard</Button>
                            <Button variant="primary" type="submit">Publish</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Modal>
        </>
    )

}
