import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import slugify from 'react-slugify';


export default function CreatePostForm(props) {

    const questionSlug = props.questionSlug;
    const answerId = props.answerId;

    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: ''
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

        var obj = { userId: userId, slug: slugify(formData.title), content: formData.content, title: formData.title, questionSlug: questionSlug, answerId: answerId };
        var js = JSON.stringify(obj);

        const response = await fetch(buildPath('api/addPost'), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

        if (response != null) {
            const json = await response.json();
        }
        else {
            console.log("Response is null");
        }
    }

    return (
        <>
            <Button variant="primary-fight" onClick={handleShow}>
                Create Post
            </Button>
            <Modal show={show} data-bs-theme="fight">
                <Card>
                    <Card.Header>Create a Post</Card.Header>
                    <Card.Body>
                        <Form className="m-3" onSubmit={handleSubmit}>
                            <Form.Group className="mb-5" controlId="formTitle">
                                <Form.Label>Post Title</Form.Label>
                                <Form.Control required name="title" type="text" placeholder="Write a witty title..." onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-5" controlId="formContent">
                                <Form.Label>Post Content</Form.Label>
                                <Form.Control required name="content" as="textarea" placeholder="Explain your answer..." onChange={handleChange} />
                            </Form.Group>
                            <Button variant="danger-fight me-3" onClick={handleClose}>Discard</Button>
                            <Button variant="primary-fight" type="submit">Publish</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Modal>
        </>
    )

}
