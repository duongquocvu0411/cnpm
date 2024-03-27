import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';

import Sidebar from './Sidebar';

const ITEMS_PER_PAGE = 5;

const DVT = () => {
  const [dvtList, setDvtList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDvtId, setEditingDvtId] = useState(null);
  const [formData, setFormData] = useState({ id: null, name: '' });
  const [operationMessage, setOperationMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/dvts');
      setDvtList(response.data);
    } catch (error) {
      console.error('Fetch DVT error:', error);
      setOperationMessage('Failed to fetch DVTs.');
    }
  };

  const totalPages = Math.ceil(dvtList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDvts = dvtList.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleShowModal = (dvtId = null) => {
    if (dvtId) {
      const dvtToEdit = dvtList.find(dvt => dvt.id === dvtId);
      setFormData({ ...dvtToEdit });
    } else {
      setFormData({ id: null, name: '' });
    }
    setEditingDvtId(dvtId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDvtId(null);
    setOperationMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id === null) {
        await axios.post('http://127.0.0.1:8000/api/dvts', formData);
        setOperationMessage('DVT added successfully.');
      } else {
        await axios.put(`http://127.0.0.1:8000/api/dvts/${formData.id}`, formData);
        setOperationMessage('DVT updated successfully.');
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Submit DVT error:', error);
      setOperationMessage('Failed to submit DVT.');
    }
  };

  const handleDeleteDvt = async (dvtId) => {
    if (window.confirm('Are you sure you want to delete this DVT?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/dvts/${dvtId}`);
        setOperationMessage('DVT deleted successfully.');
        fetchData();
      } catch (error) {
        console.error('Delete DVT error:', error);
        setOperationMessage('Failed to delete DVT.');
      }
    }
  };

  return (
    <div className="d-flex" id="wrapper">
      <Sidebar />
      <div id="page-content-wrapper">
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom"></nav>
        <Container fluid>
          <Row>
            <Col>
              <h2>Đơn Vị Tính Management</h2>
              <Button variant="primary" onClick={() => handleShowModal()} className='float-start'>Thêm Mới Đơn Vị Tính</Button>

              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>{editingDvtId ? 'Chỉnh Sửa Đơn Vị Tính' : 'Thêm Mới Đơn Vị Tính'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formUnitName">
                      <Form.Label>Tên Đơn Vị Tính</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nhập tên đơn vị tính"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">Lưu</Button>
                  </Form>
                </Modal.Body>
              </Modal>

              {operationMessage && <Alert variant="info">{operationMessage}</Alert>}

              <table className="table mt-4">
                <thead>
                  <tr>
                    <th>STT</th>
                    {/* <th>ID</th> */}
                    <th>Name</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDvts.map((dvt, index) => (
                    <tr key={dvt.id}>
                      <td>{startIndex + index + 1}</td>
                      {/* <td>{dvt.id}</td> */}
                      <td>{dvt.name}</td>
                      <td>
                        <Button variant="info" onClick={() => handleShowModal(dvt.id)}><i className="bi bi-pencil-fill"></i></Button>
                        <Button variant="danger" onClick={() => handleDeleteDvt(dvt.id)}><i className="bi bi-trash"></i></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

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
      </div>
    </div>
  );
};

export default DVT;
