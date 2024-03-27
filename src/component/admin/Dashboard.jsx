// Components/Dashboard.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

const Dashboard = () => {
  const [salesData, setSalesData] = useState({ today: 0, thisWeek: 0, thisMonth: 0 });

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      // In a real app, you'd fetch this data from your backend
      const fakeData = { today: 120, thisWeek: 800, thisMonth: 3200 };
      setSalesData(fakeData);
    };

    fetchData();
  }, []);

  return (
    <div>
       <Sidebar/>
      <h2>Dashboard</h2>
      <div>Today's Sales: ${salesData.today}</div>
      <div>This Week's Sales: ${salesData.thisWeek}</div>
      <div>This Month's Sales: ${salesData.thisMonth}</div>
    </div>
  );
};

export default Dashboard;
