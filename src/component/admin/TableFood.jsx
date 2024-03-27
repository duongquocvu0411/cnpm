import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import Sidebar from './Sidebar';

const TableFood = () => {
  const [tables, setTables] = useState([]);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ id: null, name: '', status: 'Available' });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/tablefoods');
      // Add index to each table object
      const tablesWithIndex = response.data.map((table, index) => ({ ...table, stt: index + 1 }));
      setTables(tablesWithIndex);
      setError(null); // Reset error state if successful
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data'); // Set error state if request fails
    }
  };

  const handleClose = () => {
    setShow(false);
    setEditId(null);
    setFormData({ id: null, name: '', status: 'Trống' });
  };

  const handleShow = () => setShow(true);

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id === null) {
        // Add table
        await axios.post('http://127.0.0.1:8000/api/tablefoods', formData);
      } else {
        // Edit table
        await axios.put(`http://127.0.0.1:8000/api/tablefoods/${formData.id}`, formData);
      }
      fetchData();
      handleClose();
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to save data'); // Set error state if request fails
    }
  };

  const handleEditTable = (id) => {
    const table = tables.find(t => t.id === id);
    setFormData({ id: table.id, name: table.name, status: table.status });
    setEditId(id);
    handleShow();
  };

  const handleDeleteTable = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/tablefoods/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to delete data'); // Set error state if request fails
    }
  };

  return (
    <div className="d-flex" id="wrapper">
      <Sidebar />
      <div id="page-content-wrapper">
        <Container fluid>
          <Row>
            
            <Col xs={10} id='page-content-wrapper'>
              <h2>Table Management</h2>
              <Button variant="primary" onClick={handleShow} className='float-start'>Add New Table</Button>
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>{editId ? 'Edit Table' : 'Add New Table'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleAddOrEdit}>
                    <Form.Group controlId="formTableName">
                      <Form.Label>Table Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter table name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="formTableStatus">
                      <Form.Label>Status</Form.Label>
                      <Form.Control
                        as="select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        required
                      >
                        <option value="Có Người">Có Người</option>
                        <option value="Trống">Trống</option>
                      </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit">{editId ? 'Save Changes' : 'Add Table'}</Button>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
              </Modal>
              {error && <p>Error: {error}</p>}
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tables.map((table, index) => (
                    <tr key={table.id}>
                      <td>{index + 1}</td>
                      <td>{table.name}</td>
                      <td style={{ backgroundColor: table.status === 'Có Người' ? '#dc3545' : '#28a745', color: '#fff' }}>
                        {table.status}
                      </td>
                      <td>
                        <Button variant="primary" onClick={() => handleEditTable(table.id)}><i className="bi bi-pencil-fill"></i></Button>
                        <Button variant="danger" onClick={() => handleDeleteTable(table.id)}><i className="bi bi-trash"></i></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
  
};

export default TableFood;
