import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import AddIcon from '@mui/icons-material/Add';
import BookIcon from '@mui/icons-material/Book';

const AddBook = () => {
    const [book, setBook] = useState({
        title: '',
        author: '',
        isbn: '',
        price: '',
        quantity: '',
        avatar: null
    });

    const handleInputChange = (e) => {
        if (e.target.name === 'avatar') {
            setBook({ ...book, avatar: e.target.files[0] });
        } else {
            setBook({ ...book, [e.target.name]: e.target.value });
        }
    };

    const handleAddBook = (e) => {
        e.preventDefault();

        const formData = new FormData();
        for (const key in book) {
            formData.append(key, book[key]);
        }

        axios.post('http://localhost:3001/api/admin/save-book', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                console.log(res.data);
                setBook({
                    title: '',
                    author: '',
                    isbn: '',
                    price: '',
                    quantity: '',
                    avatar: null
                });
            })
            .catch(err => console.log(err));
    };

    return (
        <Container fluid className="bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
            <Card className="shadow-lg" style={{ maxWidth: '800px', width: '100%' }}>
                <Card.Body className="p-5">
                    <Row>
                        <Col md={5} className="mb-4 mb-md-0">
                            <div className="h-100 d-flex flex-column justify-content-center align-items-center bg-primary text-white rounded p-4">
                                <BookIcon style={{ fontSize: 80 }} />
                                <h2 className="mt-4 text-center">Add a New Book</h2>
                                <p className="text-center mt-3">Expand your library with new titles</p>
                            </div>
                        </Col>
                        <Col md={7}>
                            <Form onSubmit={handleAddBook}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={book.title}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter book title"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Author</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="author"
                                        value={book.author}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter author name"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>ISBN</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="isbn"
                                        value={book.isbn}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter ISBN"
                                    />
                                </Form.Group>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Price</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="price"
                                                value={book.price}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter price"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Quantity</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="quantity"
                                                value={book.quantity}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter quantity"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>Upload Avatar</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="avatar"
                                        onChange={handleInputChange}
                                        required
                                        accept="image/*"
                                    />
                                </Form.Group>
                                <div className="d-grid mt-4">
                                    <Button variant="primary" type="submit" size="lg">
                                        <AddIcon className="me-2 mb-1" /> Add Book
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AddBook;