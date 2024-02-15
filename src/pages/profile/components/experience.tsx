import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { ConvertXp } from 'utils/convertxp'


const GET_TOTAL_XP = gql`
    query {
        transaction(where: 
            {type: {_eq: "xp"}, 
            path: {_like: "/johvi/div-01/%", 
              _nlike: "%piscine-js%"}}, 
          ) {
              amount
              type
              path
          }
    }
    `


export const Experience = () => {
    const { error, data, loading } = useQuery(GET_TOTAL_XP);
    if (loading) return <div>Loading...</div>
    console.log(data)
    const totalXp = data.transaction.reduce((total: number, transaction: { amount: number }) => total + transaction.amount, 0)
    const totalXpInKb = Math.round(totalXp / (1000));
    return (
        <div className='w-[25%] h-[12%] bg-gray-800 box-border min flex flex-col p-4 mt-4 mr-4 lg:mr-0 min-w-[317px] min-h-[250px]'>
            <p className='h-1/3'>Your current XP:</p>
            <div className='h-2/3'>
                <div className='text-6xl'>{ConvertXp(totalXp)[0]}
                    <span className='pl-4'>{ConvertXp(totalXp)[1]}</span>
                </div>
            </div>
            <div className='flex'>
                <p className='pr-2'>Latest:</p>
                {data.transaction[0].path.split("/")[3]}
            </div>
        </div>
    )
}

