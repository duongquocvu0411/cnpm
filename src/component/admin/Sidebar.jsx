import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Sidebar() {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate(); // Sử dụng hook useNavigate

    
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen); // Just toggle the state
    };
    const handleLogout = () => {
        // Hiển thị modal xác nhận logout khi người dùng nhấp vào nút Logout
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        // Thực hiện các hành động liên quan đến logout
        setShowLogoutModal(false); // Đóng modal xác nhận logout sau khi xác nhận
        // Xóa trạng thái đăng nhập từ localStorage
        localStorage.removeItem('isLoggedIn');
        // Điều hướng người dùng đến trang đăng nhập
        navigate('/');
    };
    const toggleButtonStyle = {
        position: 'fixed',
        zIndex: '1050',
        top: '20px', // Adjust based on the cursor position in your screenshot
        left: isSidebarOpen ? '200px' : '20px', // Adjust '200px' to where the sidebar ends
        transition: 'left 0.3s' // Smooth transition for the button movement
      };
    return (
         <div className={`d-flex ${isSidebarOpen ? '' : 'toggled'}`} id="wrapper">
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <button className="btn btn-primary" id="menu-toggle" onClick={toggleSidebar} style={toggleButtonStyle}>
                <i className="bi bi-list"></i>
            </button>
        </nav>
          {/* Sidebar */}
          <div className="bg-light border-right" id="sidebar-wrapper">
                <div className="sidebar-heading">Cafe Admin</div>
                <div className="list-group list-group-flush">
                    {/* Các liên kết menu */}
                    <Link to="/layout" className="list-group-item list-group-item-action bg-light">
                        <i className="bi bi-graph-up"></i> Dashboard
                    </Link>
                    <Link to="/food" className="list-group-item list-group-item-action bg-light">
                        <i className="bi bi-egg-fill"></i> Food
                    </Link>
                    <Link to="/foodCategory" className="list-group-item list-group-item-action bg-light">
                        <i className="bi bi-egg-fill"></i> FoodCategory
                    </Link>
                    <Link to="/table" className="list-group-item list-group-item-action bg-light">
                        <i className="bi bi-tablet-fill"></i> Table
                    </Link>
                    <Link to="/bill" className="list-group-item list-group-item-action bg-light">
                        <i className="bi bi-receipt"></i> Bill
                    </Link>
                    <Link to="/billinfo" className="list-group-item list-group-item-action bg-light">
                        <i className="bi bi-receipt-cutoff"></i> BillInfo
                    </Link>
                    <Link to="/employee" className="list-group-item list-group-item-action bg-light">
                        <i className="bi bi-person-fill"></i> Employee
                    </Link>
                    <Link to="/account" className="list-group-item list-group-item-action bg-light">
                        <i className="bi bi-person-circle"></i> Account
                    </Link>
                    <Link to="/dvt" className="list-group-item list-group-item-action bg-light">
                        <i className="bi bi-unity"></i> Đơn vị tính
                    </Link>
                    <Link to="/nguyenlieu" className="list-group-item list-group-item-action bg-light">
                        <i className="bi bi-egg"></i> Nguyên liệu
                    </Link>
                    <Link to="/nguyenlieusd" className="list-group-item list-group-item-action bg-light">
                        <i className="bi bi-archive-fill"></i> Nguyên liệu đã sử dụng
                    </Link>
                    <Link to="/role" className="list-group-item list-group-item-action bg-light">
                        <i className="bi bi-archive-fill"></i> Role
                    </Link>
                    {/* Nút toggle sidebar */}
                    <button className="list-group-item list-group-item-action bg-light" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right"></i> Logout
                    </button>
                </div>
            </div>
            {/* Modal xác nhận logout */}
            {showLogoutModal && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Xác nhận đăng xuất</h5>
                                <button type="button" className="close" onClick={() => setShowLogoutModal(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Bạn có chắc chắn muốn đăng xuất?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>Hủy</button>
                                <button type="button" className="btn btn-primary" onClick={confirmLogout}>Đăng xuất</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Sidebar;
