import { useQuery, gql } from '@apollo/client'
import React from "react";
import { AxisOptions, Chart } from "react-charts";


const GET_GRADES = gql`
query {
  Piscine_Go: progress(where: { path: { _like: "/johvi/piscine-go/%", _nlike:"/johvi/piscine-go/dummy-exam%" } }) {
    grade
    path
  }
  Piscine_Js: progress(where: { path: { _like: "/johvi/div-01/piscine-js/%" } }) {
    grade
    path
  }
 }
`

function getRatio(progress: any): any {
  let pass = 0;
  let fail = 0;
  progress.forEach((progress: any) => {
    if (progress.grade === 1) {
      pass += 1;
    } else {
      fail += 1;
    }
  });
  return { pass: pass, fail: fail };
}

export default function PassFail() {
  const { error, data, loading } = useQuery(GET_GRADES);
  console.log(data)

  const primaryAxis = React.useMemo<
    AxisOptions<typeof data[number]["data"][number]>
  >(
    () => ({
      position: "left",
      getValue: (datum) => datum.primary,
    }),
    []
  );

  const secondaryAxes = React.useMemo<
    AxisOptions<typeof data[number]["data"][number]>[]
  >(
    () => [
      {
        position: "bottom",
        getValue: (datum) => datum.value,
      },
    ],
    []
  );
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;
  
  const categories = ['Piscine_Go', 'Piscine_Js', "Div-01"];
  
  const transformedData = categories.map((category) => {
    const progress = data[category];
    if (!progress) return [];
    const { pass, fail } = getRatio(progress);
  
    return [
      {
        label: 'PASS',
        data: [
          {
            primary: category,
            value: pass,
          },
        ],
      },
      {
        label: 'FAIL',
        data: [
          {
            primary: category,
            value: fail,
          },
        ],
      },
    ];
  }).flat();

 

  return (
    <div className='flex justify-center mt-4 items-center'>
      <br />
      <br />
      <div className='bg-gray-800 border-none w-[95%] lg:w-[97%] h-[400px]'>
        <Chart
          options={{
            data: transformedData,
            primaryAxis,
            secondaryAxes,
          }}
        />
      </div>
    </div>
  );
}
