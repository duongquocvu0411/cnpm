import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { Row, Container, Col } from 'react-bootstrap/esm';
import Sidebar from './Sidebar';

const ITEMS_PER_PAGE = 5;

const FoodCategory = () => {
  const [categories, setCategories] = useState([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [editedCategoryId, setEditedCategoryId] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/foodcategories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Fetch food categories error:', error);
    }
  };

  const handleCloseAddCategoryModal = () => {
    setShowAddCategoryModal(false);
    setNewCategoryName('');
  };

  const handleShowAddCategoryModal = () => setShowAddCategoryModal(true);

  const handleCloseEditCategoryModal = () => {
    setShowEditCategoryModal(false);
    setEditedCategoryId(null);
    setEditedCategoryName('');
  };

  const handleShowEditCategoryModal = (categoryId, categoryName) => {
    setShowEditCategoryModal(true);
    setEditedCategoryId(categoryId);
    setEditedCategoryName(categoryName);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (newCategoryName.trim() === '') return;

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/foodcategories`, {
        name: newCategoryName
      });
      setCategories([...categories, response.data]);
      handleCloseAddCategoryModal();
    } catch (error) {
      console.error('Add category error:', error);
    }
  };

  const handleEditCategory = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/foodcategories/${editedCategoryId}`, {
        name: editedCategoryName
      });
      setCategories(categories.map(category =>
        category.id === editedCategoryId ? { ...category, name: editedCategoryName } : category));
      handleCloseEditCategoryModal();
    } catch (error) {
      console.error('Edit category error:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/foodcategories/${categoryId}`);
      setCategories(categories.filter(category => category.id !== categoryId));
      handleCloseConfirmDelete();
    } catch (error) {
      console.error('Delete category error:', error);
    }
  };

  const handleShowConfirmDelete = (categoryId) => {
    setDeleteCategoryId(categoryId);
    setShowConfirmDelete(true);
  };

  const handleCloseConfirmDelete = () => {
    setDeleteCategoryId(null);
    setShowConfirmDelete(false);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate start and end index for current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // Slice accounts array based on current page
  const paginatedCategories = categories.slice(startIndex, endIndex);

  return (
    <div className="d-flex" id="wrapper">
      <Sidebar />
      <div id="page-content-wrapper">
        <Container fluid>
          <Row>
            <Col xs={10} id='page-content-wrapper'>
              <h2>Food Category Management</h2>
              <Button variant="primary" onClick={handleShowAddCategoryModal} className='float-start'>Add New Category</Button>
              <table className="table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCategories.map((category, index) => (
                    <tr key={category.id}>
                      <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                      <td>{category.name}</td>
                      <td>
                        <button className="btn btn-danger" onClick={() => handleShowConfirmDelete(category.id)}><i className="bi bi-trash"></i></button>
                        <button className="btn btn-secondary" onClick={() => handleShowEditCategoryModal(category.id, category.name)}><i className="bi bi-pencil-fill"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <nav aria-label="Page navigation">
                <ul className="pagination">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                        {i + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </Col>
          </Row>
        </Container>

        {/* Modal for adding a new category */}
        <Modal show={showAddCategoryModal} onHide={handleCloseAddCategoryModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAddCategory}>
              <Form.Group controlId="formCategoryName">
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">Add Category</Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddCategoryModal}>Close</Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for editing a category */}
        <Modal show={showEditCategoryModal} onHide={handleCloseEditCategoryModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formEditCategoryName">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={editedCategoryName}
                onChange={(e) => setEditedCategoryName(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" onClick={handleEditCategory}>Save Changes</Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditCategoryModal}>Close</Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for confirming category deletion */}
        <Modal show={showConfirmDelete} onHide={handleCloseConfirmDelete}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this category?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseConfirmDelete}>Cancel</Button>
            <Button variant="danger" onClick={() => handleDeleteCategory(deleteCategoryId)}>Delete</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default FoodCategory;

