// // DanhThu.js
// import React from 'react';

// function Layout({ totalRevenue }) {
//   // Giả định dữ liệu tổng doanh thu
//   const fakeData = 10000; // Đây là một giá trị tổng doanh thu giả định

//   return (
//     // <div className="content-wrapper">
//     //   <section className="content-header">
//     //     <div className="container-fluid">
//     //       <div className="row mb-2">
//     //         <div className="col-sm-6">
//     //           <h1>Total Revenue Dashboard</h1>
//     //         </div>
//     //       </div>
//     //     </div>
//     //   </section>

//     //   <section className="content">
//     //     <div className="container-fluid">
//     //       <div className="row">
//     //         <div className="col-md-6">
//     //           <div className="card">
//     //             <div className="card-header">
//     //               <h3 className="card-title">Total Revenue</h3>
//     //             </div>
//     //             <div className="card-body">
//     //               <div className="d-flex justify-content-between align-items-center">
//     //                 <h3 className="text-success">Total Sales</h3>
//     //                 <h3 className="text-success">${totalRevenue || fakeData}</h3>
//     //               </div>
//     //               <div className="progress">
//     //                 <div className="progress-bar bg-success" role="progressbar" style={{ width: '70%' }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
//     //               </div>
//     //               <div className="d-flex justify-content-between mt-3">
//     //                 <span>Last Month</span>
//     //                 <span>$7,000</span>
//     //               </div>
//     //               <div className="d-flex justify-content-between mt-1">
//     //                 <span>Last Week</span>
//     //                 <span>$2,500</span>
//     //               </div>
//     //               <div className="d-flex justify-content-between mt-1">
//     //                 <span>Today</span>
//     //                 <span>$500</span>
//     //               </div>
//     //             </div>
//     //           </div>
//     //         </div>
//     //       </div>
//     //     </div>
//     //   </section>
//     // </div>
//     <>
//       <h2> Hello Admin</h2>
//     </>
//   );
// }

// export default Layout;


// BarChartComponent.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Sidebar from './Sidebar';
import { Col, Container, Row } from 'react-bootstrap';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartComponent = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: [28, 48, 40, 19, 86, 27, 90],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Add this to prevent default behaviour of full-width/height
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Bar Chart Example',
      },
    },
  };

  return (
    <>
     
     <div>
  <div className="d-flex" id="wrapper">
    <Sidebar />
    <div id="page-content-wrapper">
      <Container fluid>
        <Row>
          
          <Col xs={10} id='page-content-wrapper'>
            <h2>Biểu Đồ Doanh Thu</h2>
            <div style={{ width: '600px', height: '400px' }}>
              <Bar data={data} options={options} />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  </div>
</div>
</>
  );
};

export default BarChartComponent;


