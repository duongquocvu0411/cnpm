import React from 'react';
import {  Col, Card, Button, Form } from 'react-bootstrap';

const Menu = ({ menuItems, onAddOrder, searchKeyword, onSearchChange, dvts }) => {
  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <Col md={4}>
      <h2>Menu</h2>
      <Form.Group controlId="formSearch">
        <Form.Control type="text" placeholder="Search menu" value={searchKeyword} onChange={onSearchChange} />
      </Form.Group>
      {filteredMenu.map((item, index) => (
        <Card key={item.id} className="mb-3"> {/* Ensure `item.id` is unique */}
          <Card.Img variant="top" src={`${process.env.REACT_APP_API_URL}/storage/${item.image}`}
                  alt={item.name} 
                  style={{ width: '100px', height: '100px' }}  />
          <Card.Body>
            <Card.Title>{item.name}</Card.Title>
            <Card.Text>Price: ${item.price} / {dvts.find(dvt => dvt.id === item.unitId)?.name || 'N/A'}</Card.Text>
            <Button variant="primary" onClick={() => onAddOrder(item.name, item.price, item.unitId)}>Add to Order</Button>
          </Card.Body>
        </Card>
      ))}
    </Col>
  );
};

export default Menu;
