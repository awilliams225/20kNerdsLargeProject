import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


export default function CreatePostForm() {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button onClick={handleShow}>
                Test
            </Button>
            <Modal show={show} onHide={handleClose} data-bs-theme="dark">
                <Modal.Header closeButton>
                    <Modal.Title>Create a Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>Enter the answer you wish to post here:</Modal.Body>
                <Form className="m-3">
                    <Form.Group className="mb-5" controlId="formPostTitle">
                        <Form.Label>Post Title</Form.Label>
                        <Form.Control type="text" placeholder="Write a witty title..." />
                    </Form.Group>
                    <Form.Group className="mb-5" controlId="formPostContent">
                        <Form.Label>Post Content</Form.Label>
                        <Form.Control type="text" placeholder="Explain your answer..." />
                    </Form.Group>
                    <Button variant="warning" type="submit">Discard</Button>
                    <Button variant="primary" type="submit">Publish</Button>
                </Form>
            </Modal>
        </>
    )

}
