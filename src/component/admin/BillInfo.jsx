import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import Sidebar from './Sidebar';
const ITEMS_PER_PAGE = 5;
const BillInfo = ({ billId }) => {
  const [billDetails, setBillDetails] = useState([]);
  const [show, setShow] = useState(false);
  const [newDetail, setNewDetail] = useState({ idBill: billId, idFood: '', count: '' });
  const [editDetail, setEditDetail] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const handleCloseConfirmDelete = () => {
    setShowConfirmDelete(false);
    setDeleteItemId(null); // Reset deleteItemId
  };

  const [currentPage, setCurrentPage] = useState(1);
  // Calculate total number of pages

  const totalPages = Math.ceil(billDetails.length / ITEMS_PER_PAGE);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate start and end index for current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // Slice accounts array based on current page
  const paginatedBillinfo = billDetails.slice(startIndex, endIndex);
  useEffect(() => {
    fetchBillDetails();
  }, [billId]);

  const fetchBillDetails = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/billinfo?idBill=${billId}`);
      setBillDetails(response.data);
    } catch (error) {
      console.error('Error fetching bill details:', error);
    }
  };

  const handleClose = () => {
    setShow(false);
    setEditDetail(null);
  };

  const handleShow = () => setShow(true);

  const handleAddDetail = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/billinfo', newDetail);
      fetchBillDetails();
      handleClose();
    } catch (error) {
      console.error('Error adding detail:', error);
    }
  };

  const handleDeleteDetail = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/billinfo/${id}`);
      fetchBillDetails();
      handleCloseConfirmDelete(); // Close confirmation modal after successful deletion
    } catch (error) {
      console.error('Error deleting detail:', error);
    }
  };

  const handleEditDetail = (id) => {
    const detail = billDetails.find(d => d.id === id);
    setEditDetail(detail);
    setNewDetail({ ...detail });
    handleShow();
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/billinfo/${editDetail.id}`, newDetail);
      fetchBillDetails();
      handleClose();
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };

  return (
    <div className="d-flex" id="wrapper">
    <Sidebar />
    <div id="page-content-wrapper">
      <Container fluid>
        <Row>
          <Col>
            <h2>Bill Detail Management</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>idBill</th>
                  <th>idFood</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBillinfo.map((detail, index) => (
                  <tr key={detail.id}>
                  <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                    <td>{detail.idBill}</td>
                    <td>{detail.idFood}</td>
                    <td>{detail.count}</td>
                    <td>
                      <Button variant="primary" onClick={() => handleEditDetail(detail.id)}><i className="bi bi-pencil-fill"></i></Button>
                      <Button variant="danger" onClick={() => {
                          setDeleteItemId(detail.id);
                          setShowConfirmDelete(true);
                        }}>
                        <i className="bi bi-trash"></i>
                      </Button>
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
            <Button variant="primary" onClick={handleShow}>Add New Detail</Button>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{editDetail ? 'Edit Detail' : 'Add New Detail'}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={editDetail ? handleSaveEdit : handleAddDetail}>
                  <Form.Group controlId="formFoodId">
                    <Form.Label>Food ID</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter food ID"
                      value={newDetail.idFood}
                      onChange={(e) => setNewDetail({ ...newDetail, idFood: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formCount">
                    <Form.Label>Số lượng</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter count"
                      value={newDetail.count}
                      onChange={(e) => setNewDetail({ ...newDetail, count: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">{editDetail ? 'Save Changes' : 'Add Detail'}</Button>
                </Form>
              </Modal.Body>
            </Modal>

            <Modal show={showConfirmDelete} onHide={handleCloseConfirmDelete}>
              <Modal.Header closeButton>
                <Modal.Title>Confirmation</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete this item?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseConfirmDelete}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={() => handleDeleteDetail(deleteItemId)}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </Container>
    </div>
  </div>
  );
};

export default BillInfo;
