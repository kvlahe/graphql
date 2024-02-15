import { useQuery, gql } from '@apollo/client';
import { Chart, registerables } from 'chart.js';
import { useEffect, useState } from 'react';
import LineChart from 'components/ui/Linechart';
import { parseISO, format } from 'date-fns';


const GET_TOTAL_UP = gql`
query {
    transaction(where: 
      {type: {_eq: "xp"}, 
      path: {_like: "/johvi/div-01/%", 
        _nlike: "%piscine-js%"}}, 
    ) {
        amount
        createdAt
        path
    }
}
`;


Chart.register(...registerables);

export default function ProgressChart() {
  const { error, data, loading } = useQuery(GET_TOTAL_UP);
  const [chartData, setChartData] = useState({
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [12, 19, 3, 5, 2, 3],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        stepped: true,
      },
    ],
  });
 useEffect(() => {
  if (!loading && data) {
    // Map the transactions to an array of { amount, month } objects
    const transactions = data.transaction.map((item: any) => ({
      amount: item.amount,
      date: parseISO(item.createdAt),
      month: format(parseISO(item.createdAt), 'MMM yyyy'),
    }));

    // Sort the transactions by date
    transactions.sort((a:any, b:any) => (a.date > b.date ? 1 : -1));

    // Map the sorted transactions to separate arrays of amounts and months
    const amounts = transactions.reduce((acc: number[], item: any, index: number) => {
      const previousAmount = (index > 0) ? acc[index - 1] : 0;
      acc.push(previousAmount + item.amount);
      return acc;
    }, []);
    const months = transactions.map((item: any) => item.month);

    setChartData({
      labels: months,
      datasets: [
        {
          label: 'My First Dataset',
          data: amounts,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          stepped: true,
        },
      ],
    });
  }
}, [data]);
  return (
    <div className="App">
      <LineChart chartData={chartData} />
    </div>
  );
}