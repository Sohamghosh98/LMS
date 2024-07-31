import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Container, Navbar, Nav, Button, Modal, Form, Dropdown } from 'react-bootstrap';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import BookIcon from '@mui/icons-material/Book';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    fetchBooks();
  }, [isAuthenticated, navigate]);

  const fetchBooks = () => {
    axios.get('http://localhost:3001/api/admin/get-books')
      .then(res => setBooks(res.data))
      .catch(err => console.log(err));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setEditModalOpen(true);
  };

  const handleDeleteBook = (bookId) => {
    axios.delete(`http://localhost:3001/api/admin/${bookId}`)
      .then(res => {
        console.log(res.message);
        fetchBooks();
      })
      .catch(err => console.log(err));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3001/api/admin/${editingBook._id}`, editingBook)
      .then(res => {
        console.log(res.message);
        setEditModalOpen(false);
        fetchBooks();
      })
      .catch(err => console.log(err));
  };

  const handleInputChange = (e) => {
    setEditingBook({ ...editingBook, [e.target.name]: e.target.value });
  };

  const calculateTotalInventory = () => {
    const totalBooks = books.length;
    const totalQuantity = books.reduce((sum, book) => sum + book.quantity, 0);
    const totalValue = books.reduce((sum, book) => sum + (book.price * book.quantity), 0);
    const borrowedBooks = books.filter(book => book.borrowedBy).length;

    return { totalBooks, totalQuantity, totalValue, borrowedBooks };
  };

  const { totalBooks, totalQuantity, totalValue, borrowedBooks } = calculateTotalInventory();

  return (
    <div className="bg-gray-100 min-h-screen font-poppins">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="#home" className="flex items-center">
            <MenuBookIcon className="mr-2" />
            <span className="font-semibold">Admin Dashboard</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              <Button variant="outline-light" className="mr-2 flex items-center" onClick={() => handleNavigation('/add-book')}>
                <AddIcon className="mr-1" />
                Add Book
              </Button>
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-light" id="dropdown-basic" className="flex items-center">
                  <PersonIcon className="mr-2" />
                  Admin
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleNavigation('/admin-dashboard')} className="flex items-center">
                    <MenuBookIcon className="mr-2" />Dashboard
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout} className="flex items-center">
                    <LogoutIcon className="mr-2" />Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center transition duration-300 ease-in-out transform hover:scale-105">
            <BookIcon style={{ fontSize: 48, color: '#3B82F6' }} />
            <h3 className="text-xl font-semibold mt-2">Total Books</h3>
            <p className="text-3xl font-bold text-blue-500">{totalBooks}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center transition duration-300 ease-in-out transform hover:scale-105">
            <InventoryIcon style={{ fontSize: 48, color: '#10B981' }} />
            <h3 className="text-xl font-semibold mt-2">Total Quantity</h3>
            <p className="text-3xl font-bold text-green-500">{totalQuantity}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center transition duration-300 ease-in-out transform hover:scale-105">
            <AttachMoneyIcon style={{ fontSize: 48, color: '#F59E0B' }} />
            <h3 className="text-xl font-semibold mt-2">Total Value</h3>
            <p className="text-3xl font-bold text-yellow-500">₹{totalValue.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center transition duration-300 ease-in-out transform hover:scale-105">
            <LocalLibraryIcon style={{ fontSize: 48, color: '#EF4444' }} />
            <h3 className="text-xl font-semibold mt-2">Borrowed Books</h3>
            <p className="text-3xl font-bold text-red-500">{borrowedBooks}</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Book Inventory</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map(book => (
            <div key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
              <div className="relative h-80 overflow-hidden group">
                <img
                  src={book.avatar || '/placeholder-cover.jpg'}
                  alt={book.title}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-300 transform translate-y-full group-hover:translate-y-0 opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-400  p-4 flex flex-col justify-end opacity-30">
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                <p className="text-gray-600">Author: {book.author}</p>
                <p className="text-gray-600 mb-2">ISBN: {book.isbn}</p>
                <p className="text-gray-600 mb-2">Price: ₹{book.price.toFixed(2)}</p>
                <p className="text-gray-600 mb-2">Quantity: {book.quantity}</p>
                <p className="mb-4">
                  Status: {book.borrowedBy ? (
                    <span className="text-yellow-500 font-semibold">Borrowed</span>
                  ) : (
                    <span className="text-green-500 font-semibold">Available</span>
                  )}
                </p>
                <div className="flex justify-between">
                  <Button variant="outline-primary" size="sm" onClick={() => handleEditBook(book)} className="flex items-center">
                    <EditIcon fontSize="small" className="mr-1" /> Edit
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDeleteBook(book._id)} className="flex items-center">
                    <DeleteIcon fontSize="small" className="mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <Modal show={editModalOpen} onHide={() => setEditModalOpen(false)} size="lg">
        <Modal.Header closeButton className="bg-gray-100">
          <Modal.Title className="flex items-center text-xl font-semibold">
            <BookIcon className="mr-2 text-green-500" />
            Edit Book
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" name="title" value={editingBook?.title || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </Form.Group>
              <Form.Group>
                <Form.Label>Author</Form.Label>
                <Form.Control type="text" name="author" value={editingBook?.author || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </Form.Group>
              <Form.Group>
                <Form.Label>ISBN</Form.Label>
                <Form.Control type="text" name="isbn" value={editingBook?.isbn || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </Form.Group>
              <Form.Group>
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" name="price" value={editingBook?.price || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </Form.Group>
              <Form.Group>
                <Form.Label>Quantity</Form.Label>
                <Form.Control type="number" name="quantity" value={editingBook?.quantity || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;