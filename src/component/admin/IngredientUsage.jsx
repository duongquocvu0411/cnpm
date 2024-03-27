import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import Sidebar from './Sidebar';
const ITEMS_PER_PAGE = 5;
const API_URL = 'http://127.0.0.1:8000/api/ingredientusages';

const IngredientUsage = () => {
  const [usageList, setUsageList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [editingUsageId, setEditingUsageId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, ingredient_id: '', quantity_used: '', order_id: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        setUsageList(response.data);
        setTotalPages(Math.ceil(response.data.length / ITEMS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedIngredientUsage = usageList.slice(startIndex, endIndex);

  const handleShowModal = (usageId = null) => {
    if (usageId) {
      const usageToEdit = usageList.find(usage => usage.id === usageId);
      setFormData({ ...usageToEdit });
    } else {
      setFormData({ id: null, ingredient_id: '', quantity_used: '', order_id: '' });
    }
    setEditingUsageId(usageId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUsageId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id === null) {
        const response = await axios.post(API_URL, formData);
        setUsageList([...usageList, response.data]);
      } else {
        await axios.put(`${API_URL}/${formData.id}`, formData);
        const updatedUsages = usageList.map(usage =>
          usage.id === formData.id ? formData : usage
        );
        setUsageList(updatedUsages);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteUsage = async (usageId) => {
    try {
      await axios.delete(`${API_URL}/${usageId}`);
      const updatedUsages = usageList.filter(usage => usage.id !== usageId);
      setUsageList(updatedUsages);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
    <div className="d-flex" id="wrapper">
    <Sidebar />
     
      <Container fluid>
        <Row>
          <Col xs={10}>
            <h2>Quản Lý Sử Dụng Nguyên Liệu</h2>
            <Button variant="primary" onClick={() => handleShowModal()}>Thêm Mới Sử Dụng</Button>

            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>{editingUsageId ? 'Chỉnh Sửa Sử Dụng' : 'Thêm Mới Sử Dụng'}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formIngredientId">
                    <Form.Label>Ingredient ID</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Nhập ID nguyên liệu"
                      value={formData.ingredient_id}
                      onChange={(e) => setFormData({ ...formData, ingredient_id: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formQuantityUsed">
                    <Form.Label>Quantity Used</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Nhập số lượng sử dụng"
                      value={formData.quantity_used}
                      onChange={(e) => setFormData({ ...formData, quantity_used: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formOrderId">
                    <Form.Label>Order ID</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Nhập ID đơn hàng"
                      value={formData.order_id}
                      onChange={(e) => setFormData({ ...formData, order_id: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">Lưu</Button>
                </Form>
              </Modal.Body>
            </Modal>

            <table className="table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Ingredient ID</th>
                  <th>Quantity Used</th>
                  <th>Order ID</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedIngredientUsage.map((usage, index) => (
                  <tr key={index}>
                    <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                    <td>{usage.ingredient_id}</td>
                    <td>{usage.quantity_used}</td>
                    <td>{usage.order_id}</td>
                    <td>
                      <Button variant="info" onClick={() => handleShowModal(usage.id)}><i className="bi bi-pencil-fill"></i></Button>
                      <Button variant="danger" onClick={() => handleDeleteUsage(usage.id)}><i className="bi bi-trash"></i></Button>
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

export default IngredientUsage;
