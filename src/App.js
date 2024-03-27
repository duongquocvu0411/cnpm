import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './component/admin/Login';
import ProtectedRoute from './component/ProtectedRoute ';
import Home from './component/admin/Home';
import Menu from './component/giaodien/menu';
import Layout from './component/admin/layout';
import Order from './component/giaodien/Order';
import Food from './component/admin/Food';
import FoodCategory from './component/admin/FoodCategory';
import Bill from './component/admin/Bill';
import BillInfo from './component/admin/BillInfo';
import Employee from './component/admin/Employee';
import Account from './component/admin/Account';
import DVT from './component/admin/Dvt';
import Ingredient from './component/admin/Ingredient ';
import IngredientUsage from './component/admin/IngredientUsage';
import Role from './component/admin/Role';
import TableFood from './component/admin/TableFood';


// Import các component khác

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/Home' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
         <Route path='/login' element={
          <ProtectedRoute>
            <Login />
          </ProtectedRoute>
        } />
        <Route path='/menu' element={
          <ProtectedRoute>
            <Menu />
          </ProtectedRoute>
        } />
         <Route path='/layout' element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        } />
         <Route path='/order' element={
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>
        } />
         <Route path='/food' element={
          <ProtectedRoute>
            <Food />
          </ProtectedRoute>
        } />
         <Route path='/table' element={
          <ProtectedRoute>
            <TableFood />
          </ProtectedRoute>
        } />
        <Route path='/foodCategory' element={
          <ProtectedRoute>
            <FoodCategory />
          </ProtectedRoute>
        } />
        <Route path='/bill' element={
          <ProtectedRoute>
            <Bill />
          </ProtectedRoute>
        } />
        <Route path='/billinfo' element={
          <ProtectedRoute>
            <BillInfo />
          </ProtectedRoute>
        } />
        <Route path='/employee' element={
          <ProtectedRoute>
            <Employee />
          </ProtectedRoute>
        } />
        <Route path='/account' element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        } />
        <Route path='/dvt' element={
          <ProtectedRoute>
            <DVT />
          </ProtectedRoute>
        } />
        <Route path='/nguyenlieu' element={
          <ProtectedRoute>
            <Ingredient />
          </ProtectedRoute>
        } />
       <Route path='/nguyenlieusd' element={
          <ProtectedRoute>
            <IngredientUsage />
          </ProtectedRoute>
        } />
        <Route path='/role' element={
          <ProtectedRoute>
            <Role />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
