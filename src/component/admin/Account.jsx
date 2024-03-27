import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import Sidebar from './Sidebar';

const ITEMS_PER_PAGE = 5;

const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [editingAccountId, setEditingAccountId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [formData, setFormData] = useState({ UserName: '', DisplayName: '', PassWord: '', Type: '', roleID: '', idEmployee: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteAccountId, setDeleteAccountId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  useEffect(() => {
    fetchAccounts();
    fetchRoles();
    fetchEmployees();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/roles');
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles", error);
      setError("Failed to fetch roles.");
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees", error);
      setError("Failed to fetch employees.");
    }
  };

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/accounts');
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts", error);
      setError("Failed to fetch accounts.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (accountId = null) => {
    if (accountId) {
      const accountToEdit = accounts.find(account => account.id === accountId);
      setFormData({ ...accountToEdit, PassWord: accountToEdit.PassWord, roleID: accountToEdit.Type }); 
    } else {
      setFormData({ UserName: '', DisplayName: '', PassWord: '', Type: '', roleID: '', idEmployee: '' }); 
    }
    setEditingAccountId(accountId);
    setShowModal(true);
  };
  const handleShowConfirmDelete = (accountId) => {
    setDeleteAccountId(accountId);
    setShowConfirmDelete(true);
};
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAccountId(null);
    setFormData({ UserName: '', DisplayName: '', PassWord: '', Type: '', roleID: '', idEmployee: '' }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...formData, roleID: formData.Type }; 
      if (editingAccountId === null) {
        await axios.post('http://127.0.0.1:8000/api/accounts', data);
      } else {
        await axios.put(`http://127.0.0.1:8000/api/accounts/${editingAccountId}`, data);
      }
      fetchAccounts();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving account", error);
      setError("Failed to save account. Please check your input data and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (accountId) => {
    setLoading(true);
    try {
        await axios.delete(`http://127.0.0.1:8000/api/accounts/${accountId}`);
        fetchAccounts();
        setShowConfirmDelete(false); // Đóng modal sau khi xóa thành công
        setDeleteAccountId(null); // Reset ID của tài khoản cần xóa
    } catch (error) {
        console.error("Error deleting account", error);
        setError("Failed to delete account.");
    } finally {
        setLoading(false);
    }
};

  const totalPages = Math.ceil(accounts.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedAccounts = accounts.slice(startIndex, endIndex);

 const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="d-flex" id="wrapper">
      <Sidebar />
      <div id="page-content-wrapper">
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom"></nav>
        <Container fluid>
          <Row>
            <Col>
              <h2>Account Management</h2>
              <Button variant="primary" onClick={() => handleShowModal()} disabled={loading}>
                Add New Account
              </Button>

              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>{editingAccountId ? 'Edit Account' : 'Add New Account'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formUserName">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={formData.UserName}
                        onChange={(e) => setFormData({ ...formData, UserName: e.target.value })}
                        readOnly={Boolean(editingAccountId)}
                      />
                    </Form.Group>
                    <Form.Group controlId="formDisplayName">
                      <Form.Label>Display Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter display name"
                        value={formData.DisplayName}
                        onChange={(e) => setFormData({ ...formData, DisplayName: e.target.value })}
                        readOnly={Boolean(editingAccountId)}
                      />
                    </Form.Group>
                    <Form.Group controlId="formPassWord">
                    <Form.Label>Password</Form.Label>
                    <div className="input-group">
                      <Form.Control
                        type={showPassword2 ? "text" : "password"}
                        placeholder="Enter password"
                        value={formData.PassWord}
                        onChange={(e) => setFormData({ ...formData, PassWord: e.target.value })}
                        required={!editingAccountId} 
                      />
                      <div className="input-group-append">
                        <span className="input-group-text" onClick={() => setShowPassword2(!showPassword2)}>
                          <i className={`fa ${showPassword2 ? 'fa-eye-slash' : 'fa-eye'}`} />
                        </span>
                      </div>
                    </div>
                  </Form.Group>
                    <Form.Group controlId="formType">
                      <Form.Label>Type</Form.Label>
                      <Form.Control
                        as="select"
                        value={formData.Type}
                        onChange={(e) => setFormData({ ...formData, Type: parseInt(e.target.value) || '' })}
                        disabled={Boolean(editingAccountId)} 
                      >
                        <option value="">Select a type</option>
                        <option value="1">Admin</option>
                        <option value="2">Employee</option>
                      </Form.Control>
                      {formData.Type === '' && <Form.Text className="text-danger">Please select a type.</Form.Text>}
                    </Form.Group>
                    <Form.Group controlId="formRoleID">
                      <Form.Label>Role</Form.Label>
                      <Form.Control
                        as="select"
                        value={formData.roleID}
                        onChange={(e) => setFormData({ ...formData, roleID: e.target.value })}
                        disabled={Boolean(editingAccountId)} 
                      >
                        <option value="">Select a role</option>
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="formIdEmployee">
                      <Form.Label>idEmployee</Form.Label>
                      <Form.Control
                        as="select"
                        value={formData.idEmployee}
                        onChange={(e) => setFormData({ ...formData, idEmployee: e.target.value })}
                        disabled={Boolean(editingAccountId)} 
                      >
                      <option value="">Select an employee</option>
                      {employees.map(employee => (
                        <option key={employee.id} value={employee.id}>{employee.name}</option>
                      ))}
                    </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit">Save</Button>
                  </Form>
                </Modal.Body>
              </Modal>

              <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)}>
              <Modal.Header closeButton>
                  <Modal.Title>Confirm Delete</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  Are you sure you want to delete this account?
              </Modal.Body>
              <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>Cancel</Button>
                  <Button variant="danger" onClick={() => handleDeleteAccount(deleteAccountId)}>Delete</Button>
              </Modal.Footer>
          </Modal>


              <table className="table mt-4">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Username</th>
                    <th>Display Name</th>
                    <th>Password</th>
                    <th>Type</th>
                    <th>Role</th>
                    <th>idEmployee</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAccounts.map((account, index) => (
                    <tr key={account.id}>
                      <td>{startIndex + index + 1}</td>
                      <td>{account.UserName}</td>
                      <td>{account.DisplayName}</td>
                      <td>
            {showPassword ? (
              <span>{account.PassWord}</span>
            ) : (
              <span>********</span>
            )}
            <i
              className={`bi bi-eye${showPassword ? '-slash' : ''}`}
              onClick={toggleShowPassword}
              style={{ cursor: 'pointer', marginLeft: '5px' }}
            ></i>
          </td>
                      <td>{account.Type}</td>
                      <td>{roles.find(role => role.id === account.roleID)?.name}</td>
                      <td>{employees.find(employee => employee.id === account.idEmployee)?.name || '-'}</td>
                      <td>
                        <Button variant="info" onClick={() => handleShowModal(account.id)}><i className="bi bi-pencil-fill"></i></Button>
                        {' '}
                        <Button variant="danger" onClick={() => handleShowConfirmDelete(account.id)}><i className="bi bi-trash"></i></Button>

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

              {error && <div className="alert alert-danger" role="alert">{error}</div>}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Account;

