// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   // Kiểm tra trạng thái đăng nhập khi component được tải lần đầu
//   useEffect(() => {
//     // Kiểm tra localStorage để xem người dùng đã đăng nhập trước đó hay chưa
//     const isLoggedIn = localStorage.getItem('isLoggedIn');

//     // Nếu người dùng đã đăng nhập, điều hướng người dùng đến trang phù hợp
//     if (isLoggedIn) {
//       navigate('/home');
//     }
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch('http://127.0.0.1:8000/api/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ UserName: username, PassWord: password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log('Loại tài khoản từ server:', data.accountType);
//         if (data.accountType === 'admin') {
//           // Lưu trạng thái đăng nhập vào localStorage
//           localStorage.setItem('isLoggedIn', true);
//           navigate('/home');
//         } else if (data.accountType === 'employee') {
//           localStorage.setItem('isLoggedIn', true);
//           navigate('/order');
//         } else {
//           setError('Tài khoản của bạn không có quyền truy cập.');
//         }
//       } else {
//         setError(data.message || 'Đăng nhập không thành công.');
//       }
//     } catch (error) {
//       setError('Có lỗi xảy ra khi kết nối với server.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container vh-100">
//       <div className="row h-100 justify-content-center align-items-center">
//         <div className="col-sm-8 col-lg-5">
//           <div className="card">
//             <div className="card-header text-white bg-primary">
//               <h4 className="card-title mb-0">
//                 <i className="bi-grid-3x3-gap-fill" /> Login
//               </h4>
//             </div>
//             <div className="card-body bg-white rounded-bottom">
//               <form onSubmit={handleLogin}>
//                 <div className="mb-3">
//                   <label htmlFor="inputUsername" className="form-label">User name</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="inputUsername"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="inputPassword" className="form-label">Password</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     id="inputPassword"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                 </div>
//                 {error && <div className='alert alert-danger' role='alert'>{error}</div>}
                
//                 <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập khi component được tải lần đầu
  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi component được tải lần đầu
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      const accountType = localStorage.getItem('accountType');
      navigate(accountType === 'admin' ? '/layout' : '/order');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ UserName: username, PassWord: password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('accountType', data.accountType);
        localStorage.setItem('idEmployee', data.idEmployee); // Lưu idEmployee vào localStorage

        // Điều hướng dựa trên loại tài khoản
        navigate(data.accountType === 'admin' ? '/layout' : '/order');
      } else {
        setError(data.message || 'Đăng nhập không thành công.');
      }
    } catch (error) {
      console.error('Error during the login process:', error);
      setError('Có lỗi xảy ra khi kết nối với server.');
    } finally {
      setLoading(false);
    }
  };
  // const handleLoginSuccess = () => {
  //   localStorage.setItem('isLoggedIn', 'true');
  //   // Chuyển hướng người dùng sau khi đăng nhập thành công
  //   navigate('/home'); // Thay đổi '/home' thành route mặc định bạn muốn chuyển đến
  // };
  return (
    <div className="container vh-100">
      <div className="row h-100 justify-content-center align-items-center">
        <div className="col-sm-8 col-lg-5">
          <div className="card">
            <div className="card-header text-white bg-primary">
              <h4 className="card-title mb-0">
                <i className="bi-grid-3x3-gap-fill" /> Login
              </h4>
            </div>
            <div className="card-body bg-white rounded-bottom">
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="inputUsername" className="form-label">User name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputUsername"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="inputPassword" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="inputPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <div className='alert alert-danger' role='alert'>{error}</div>}
                
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

