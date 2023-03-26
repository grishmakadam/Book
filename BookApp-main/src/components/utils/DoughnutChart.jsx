import React, { useState } from 'react'
import { Doughnut } from 'react-chartjs-2';
import Chart from "chart.js/auto";
import { useSelector } from 'react-redux';

const DoughnutChart = () => {
  const books = useSelector(state => state.books)

  const getLength = (type) => {
    return books.filter(x => x.Status == type).length
  }
  const data1 = {
    labels: [
      'Reading',
      'Completed',
      'Want to Read'
    ],
    datasets: [{
      label: 'My Books',
      data: [getLength("Reading"), getLength("Completed"), getLength("Want to Read")],
      backgroundColor: [
        'orange',
        'green',
        'blue'
      ],
      hoverOffset: 4
    }]
  };

  return (
    <>
      <div style={{ width: 400 }}>
        <Doughnut data={data1} /> </div>
      <div style={{ width: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center',alignItems:'flex-start'}}>
        <div>Books Read:{getLength("Completed")}</div>
        <div>To be read:{getLength("Want to Read")}</div>
        <div>Reading:{getLength("Reading")}</div>

      </div>
    </>
  )
}

export default DoughnutChart