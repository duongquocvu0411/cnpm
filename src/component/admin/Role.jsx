import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import Sidebar from './Sidebar';
const ITEMS_PER_PAGE = 5;
const Role = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState({ id: '', name: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRole, setEditRole] = useState(null);
  // const [serialNumber, setSerialNumber] = useState(1); // State variable for serial number
  const [currentPage, setCurrentPage] = useState(1);
  // Calculate total number of pages
  const totalPages = Math.ceil(roles.length / ITEMS_PER_PAGE);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate start and end index for current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // Slice accounts array based on current page
  const paginatedRoles= roles.slice(startIndex, endIndex);
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles', error);
    }
  };

  const handleAddRole = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewRole({ id: '', name: '' });
  };

  const handleEditRole = (role) => {
    setEditRole(role);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditRole(null);
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    try {
      if (editRole) {
        await axios.put(`http://localhost:8000/api/roles/${editRole.id}`, editRole);
        fetchRoles();
        handleCloseEditModal();
      } else {
        await axios.post('http://localhost:8000/api/roles', newRole);
        fetchRoles();
        handleCloseAddModal();
      }
    } catch (error) {
      console.error('Error saving role', error);
    }
  };

  const handleDeleteRole = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/roles/${id}`);
      fetchRoles();
    } catch (error) {
      console.error('Error deleting role', error);
    }
  };

  return (
    <div>
      <div className="d-flex" id="wrapper">
      <Sidebar />
      <div id="page-content-wrapper"></div>
      <Container fluid>
        <Row>
        
        <Col xs={10} id='page-content-wrapper'>
      <h2>Role Management</h2>
      <Button variant="primary" onClick={handleAddRole}>Add New Role</Button>
      <Table >
        <thead>
          <tr>
            <th>STT</th>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRoles.map((role, index) => (
            <tr key={role.id}>
             <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
              <td>{role.id}</td>
              <td>{role.name}</td>
              <td>
                <Button variant="primary" onClick={() => handleEditRole(role)}><i className="bi bi-pencil-fill"></i></Button>
                <Button variant="danger" onClick={() => handleDeleteRole(role.id)}><i className="bi bi-trash"></i></Button>
              </td>
            </tr>
          ))}
        </tbody>
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
      </Table>

      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveRole}>
            <Form.Group controlId="formRoleId">
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter ID"
                value={newRole.id}
                onChange={(e) => setNewRole({ ...newRole, id: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formRoleName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">Add Role</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveRole}>
            <Form.Group controlId="formRoleId">
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter ID"
                value={editRole ? editRole.id : ''}
                onChange={(e) => setEditRole({ ...editRole, id: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formRoleName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={editRole ? editRole.name : ''}
                onChange={(e) => setEditRole({ ...editRole, name: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">Save Changes</Button>
          </Form>
        </Modal.Body>
      </Modal>
      </Col>
      </Row>
      </Container>
    </div>
    </div>
  );
};

export default Role;
