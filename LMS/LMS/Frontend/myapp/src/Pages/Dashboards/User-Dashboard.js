import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Navbar, Nav, Card, Table, Button, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { ExitToApp, Book, BookmarkBorder, Dashboard, LibraryBooks } from '@material-ui/icons';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    if (userInfo) {
      setUser(userInfo);
      fetchBooks(userInfo.userId);
    } else {
      setLoading(false);
    }
  }, []);

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  async function fetchBooks(userId) {
    try {
      setLoading(true);
      const availableResponse = await axios.get('http://localhost:3001/api/books');
      setAvailableBooks(availableResponse.data.filter(book => book.quantity > 0));

      const borrowedResponse = await axios.get(`http://localhost:3001/api/books/borrowed/${userId}`);
      setBorrowedBooks(borrowedResponse.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleBorrow = async (bookId) => {
    if (!user) {
      console.error('User not logged in');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/api/books/borrow',
        { bookId, userId: user.userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBooks(user.userId);
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };

  const handleReturn = async (bookId) => {
    if (!user) {
      console.error('User not logged in');
      return;
    }
    try {
      await axios.post('http://localhost:3001/api/books/return', { bookId });
      fetchBooks(user.userId);
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!user) {
    return (
      <Container className="mt-5">
        <Card className="text-center shadow" style={{ maxWidth: '400px', margin: 'auto' }}>
          <Card.Body className="p-5">
            <Card.Title as="h2" className="mb-4 fw-bold">Welcome to the Library</Card.Title>
            <Card.Text className="mb-4">Please log in to view the dashboard.</Card.Text>
            <Button variant="primary" href="/login" size="lg" className="px-4 py-2">Log In</Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand href="#home" className="d-flex align-items-center">
            <LibraryBooks className="me-2" />
            <span className="fw-bold">Library Dashboard</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              <Nav.Link href="#home" className="d-flex align-items-center">
                <Dashboard className="me-1" /> Dashboard
              </Nav.Link>
              <Nav.Link onClick={handleLogout} className="d-flex align-items-center">
                <ExitToApp className="me-1" /> Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-5">
        <Row className="mb-4">
          <Col md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="p-4">
                <h3 className="mb-4 fw-bold text-primary">Quick Stats</h3>
                <p className="fs-5">Total Available Books: <Badge bg="primary" className="fs-6 ml-5">{availableBooks.length}</Badge></p>
                <p className="fs-5">Your Borrowed Books: <Badge bg="success" className="fs-6 ml-4">{borrowedBooks.length}</Badge></p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="p-4">
                <h3 className="mb-4 fw-bold text-primary">Library Rules</h3>
                <ul className="fs-5">
                  <li>Return period is 14 days from the borrow date.</li>
                  <li>Late returns may incur a fee.</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Card className="mb-5 shadow-sm">
          <Card.Header as="h5" className="bg-primary text-white py-3">
            <Book className="me-2" /> Available Books
          </Card.Header>
          <Card.Body className="p-0">
            <Table striped bordered hover responsive className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="py-3 px-4">Cover</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {availableBooks.map((book) => (
                  <tr key={book._id}>
                    <td className="py-3 px-4">
                      <div
                        className="book-cover"
                        style={{
                          width: '50px',
                          height: '75px',
                          backgroundImage: `url(${book.avatar || '/placeholder-cover.jpg'})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          transition: 'transform 0.3s ease-in-out',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.4)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </td>
                    <td className="py-3 px-4">{book.title}</td>
                    <td className="py-3 px-4">{book.author}</td>
                    <td className="py-3 px-4">{book.quantity}</td>
                    <td className="py-3 px-4">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleBorrow(book._id)}
                        className="px-3 py-2 fw-bold"
                      >
                        Borrow
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <Card className="shadow-sm">
          <Card.Header as="h5" className="bg-success text-white py-3">
            <BookmarkBorder className="me-2" /> Your Borrowed Books
          </Card.Header>
          <Card.Body className="p-0">
            <Table striped bordered hover responsive className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="py-3 px-4">Cover</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Borrow Date</th>
                  <th className="py-3 px-4">Return Date</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {borrowedBooks.map((book) => (
                  <tr key={book._id}>
                    <td className="py-3 px-4">
                      <div
                        className="book-cover"
                        style={{
                          width: '50px',
                          height: '75px',
                          backgroundImage: `url(${book.avatar || '/placeholder-cover.jpg'})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          transition: 'transform 0.3s ease-in-out',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.4)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </td>
                    <td className="py-3 px-4">{book.title}</td>
                    <td className="py-3 px-4">{book.author}</td>
                    <td className="py-3 px-4">{new Date(book.borrowedDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{new Date(book.returnDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleReturn(book._id)}
                        className="px-3 py-2 fw-bold"
                      >
                        Return
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default UserDashboard;