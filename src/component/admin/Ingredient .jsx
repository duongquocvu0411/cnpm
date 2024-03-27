import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Sidebar from './Sidebar';

const ITEMS_PER_PAGE = 5;

const Ingredient = () => {
  const [ingredients, setIngredients] = useState([]);
  const [dvtList, setDvtList] = useState([]);
  const [editingIngredientId, setEditingIngredientId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteIngredientId, setDeleteIngredientId] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    initial_quantity: '',
    unitID: ''
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total number of pages
  const totalPages = Math.ceil(ingredients.length / ITEMS_PER_PAGE);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate start and end index for current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // Slice accounts array based on current page
  const paginatedIngredient = ingredients.slice(startIndex, endIndex);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/ingredients')
      .then(response => {
        setIngredients(response.data);
      })
      .catch(error => {
        console.error('Error fetching ingredients:', error);
      });

    axios.get('http://127.0.0.1:8000/api/dvts')
      .then(response => {
        setDvtList(response.data);
      })
      .catch(error => {
        console.error('Error fetching units:', error);
      });
  }, []);

  const handleShowModal = (ingredientId = null) => {
    if (ingredientId) {
      const ingredientToEdit = ingredients.find(ingredient => ingredient.id === ingredientId);
      setFormData({ ...ingredientToEdit });
    } else {
      setFormData({ id: null, name: '', initial_quantity: '', unitID: '' });
    }
    setEditingIngredientId(ingredientId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingIngredientId(null);
  };

  const handleCloseConfirmDelete = () => {
    setShowConfirmDelete(false);
    setDeleteIngredientId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id === null) {
      axios.post('http://127.0.0.1:8000/api/ingredients', formData)
        .then(response => {
          setIngredients([...ingredients, response.data]);
        })
        .catch(error => {
          console.error('Error adding ingredient:', error);
        });
    } else {
      axios.put(`http://127.0.0.1:8000/api/ingredients/${formData.id}`, formData)
        .then(response => {
          const updatedIngredients = ingredients.map(ingredient =>
            ingredient.id === formData.id ? response.data : ingredient
          );
          setIngredients(updatedIngredients);
        })
        .catch(error => {
          console.error('Error updating ingredient:', error);
        });
    }
    handleCloseModal();
  };

  const handleDeleteIngredient = () => {
    axios.delete(`http://127.0.0.1:8000/api/ingredients/${deleteIngredientId}`)
      .then(() => {
        const updatedIngredients = ingredients.filter(ingredient => ingredient.id !== deleteIngredientId);
        setIngredients(updatedIngredients);
        handleCloseConfirmDelete();
      })
      .catch(error => {
        console.error('Error deleting ingredient:', error);
      });
  };

  return (
    <div>
      <div className="d-flex" id="wrapper">
        <Sidebar />
        <div id="page-content-wrapper"></div>
        <Container fluid>
          <Row>

            <Col xs={10} id='page-content-wrapper'>
              <h2>Quản Lý Nguyên Liệu</h2>
              <Button variant="primary" onClick={() => handleShowModal()}>Thêm Mới Nguyên Liệu</Button>

              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>{editingIngredientId ? 'Chỉnh Sửa Nguyên Liệu' : 'Thêm Mới Nguyên Liệu'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formIngredientName">
                      <Form.Label>Tên Nguyên Liệu</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nhập tên nguyên liệu"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="formInitialQuantity">
                      <Form.Label>Số Lượng Ban Đầu</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Nhập số lượng ban đầu"
                        value={formData.initial_quantity}
                        onChange={(e) => setFormData({ ...formData, initial_quantity: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="formUnitID">
                      <Form.Label>Đơn Vị</Form.Label>
                      <Form.Control
                        as="select"
                        value={formData.unitID}
                        onChange={(e) => setFormData({ ...formData, unitID: e.target.value })}
                        required
                      >
                        <option value="">Chọn đơn vị</option>
                        {dvtList.map(unit => (
                          <option key={unit.id} value={unit.id}>{unit.name}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>

                    <Button variant="primary" type="submit">Lưu</Button>
                  </Form>
                </Modal.Body>
              </Modal>

              <Modal show={showConfirmDelete} onHide={handleCloseConfirmDelete}>
                <Modal.Header closeButton>
                  <Modal.Title>Xác Nhận</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Bạn có chắc chắn muốn xóa nguyên liệu này không?
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseConfirmDelete}>
                    Hủy
                  </Button>
                  <Button variant="danger" onClick={handleDeleteIngredient}>
                    Xóa
                  </Button>
                </Modal.Footer>
              </Modal>

              <table className="table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên Nguyên Liệu</th>
                    <th>Số Lượng Ban Đầu</th>
                   <th>Đơn Vị</th>
  <th>Thao Tác</th>
</tr>
</thead>
<tbody>
{paginatedIngredient.map((ingredient, index) => (
  <tr key={index}>
    <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
    <td>{ingredient.name}</td>
    <td>{ingredient.initial_quantity}</td>
    <td>{dvtList.find(unit => unit.id === ingredient.unitID)?.name || 'Đang tải...'}</td>
    <td>
      <Button variant="info" onClick={() => handleShowModal(ingredient.id)}><i className="bi bi-pencil-fill"></i></Button>
      <Button variant="danger" onClick={() => {
        setDeleteIngredientId(ingredient.id);
        setShowConfirmDelete(true);
      }}><i className="bi bi-trash"></i></Button>
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
</div>
</div>
);
};

export default Ingredient;
