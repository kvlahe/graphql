import { gql, useQuery } from '@apollo/client'
import { ConvertXp } from 'utils/convertxp'
import { Progress } from 'components/ui/progress';

const GET_TOTAL_UP = gql`
query
{
    transaction(where: 
      {type: {_in: ["up", "down"]}, 
      path: {_like: "/johvi/div-01/%", 
        _nlike: "%piscine-js%"}}, 
    ) {
        amount
        type
        path
        }
    }
    `

interface RatioProps {
    ratio: string;
    up: number;
    down: number;
}
function getRatio(transactions: any): RatioProps {
    let up = 0;
    let down = 0;
    transactions.forEach((transaction: any) => {
        if (transaction.type === 'up') {
            up += transaction.amount;
        } else {
            down += transaction.amount;
        }
    });
    return { ratio: (up / down).toFixed(1), up: up, down: down };
}

export const Audits = () => {
    const { error, data, loading } = useQuery(GET_TOTAL_UP);

    if (error) {
        console.log(error)
        return <div></div>
    }
    if (loading) return <div>Loading...</div>
    return (
        <div className='w-[25%] h-[20%] bg-gray-800 box-border min flex flex-col p-4 mt-4 min-w-[317px] min-h-[250px] space-y-4'>
            <h1>Audits ratio</h1>
            <div className='flex'>
                <div className='flex items-center'>
                    <Progress className='w-[180px]' barBackground='bg-gray-800' barColor='bg-blue-200' value={getRatio(data.transaction).up / getRatio(data.transaction).down * 100} />
                </div>
                <div className='pl-[46px]'>
                    <div className='flex'>
                        <div className=''>{ConvertXp(getRatio(data.transaction).up)[0]}</div>
                        <span className='pl-2'>{ConvertXp(getRatio(data.transaction).up)[1]}</span>
                    </div>
                    <div className='flex'>
                        <p>Done</p>
                        <svg className='ml-2' width="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12 3C12.2652 3 12.5196 3.10536 12.7071 3.29289L19.7071 10.2929C20.0976 10.6834 20.0976 11.3166 19.7071 11.7071C19.3166 12.0976 18.6834 12.0976 18.2929 11.7071L13 6.41421V20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20V6.41421L5.70711 11.7071C5.31658 12.0976 4.68342 12.0976 4.29289 11.7071C3.90237 11.3166 3.90237 10.6834 4.29289 10.2929L11.2929 3.29289C11.4804 3.10536 11.7348 3 12 3Z" fill="#ffffff"></path> </g></svg>
                    </div>
                </div>
            </div>
            <div className='flex'>
                <div className='flex'>
                    <Progress barColor='bg-red-400' className='w-[180px] mt-1' value={100} />
                </div>
                <div className='pl-4'>
                    <div className='flex'>
                        <p>Received</p>
                        <svg viewBox="0 0 24 24" width="16px" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(180)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12 3C12.2652 3 12.5196 3.10536 12.7071 3.29289L19.7071 10.2929C20.0976 10.6834 20.0976 11.3166 19.7071 11.7071C19.3166 12.0976 18.6834 12.0976 18.2929 11.7071L13 6.41421V20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20V6.41421L5.70711 11.7071C5.31658 12.0976 4.68342 12.0976 4.29289 11.7071C3.90237 11.3166 3.90237 10.6834 4.29289 10.2929L11.2929 3.29289C11.4804 3.10536 11.7348 3 12 3Z" fill="#ffffff"></path> </g></svg>
                    </div>
                    <div className='flex'>
                        <p className='pl-5'>{ConvertXp(getRatio(data.transaction).down)[0]}</p>
                        <span className='pl-2'>{ConvertXp(getRatio(data.transaction).down)[1]}</span>
                    </div>
                </div>
            </div>
            <div className={`text-6xl !mt-1 ${Number(getRatio(data.transaction).ratio) < 0.5 ? 'text-red-400' : ''}`}>
                {getRatio(data.transaction).ratio}
            </div>
        </div>
    )
}

