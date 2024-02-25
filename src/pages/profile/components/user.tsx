import { useQuery, gql } from '@apollo/client'

const GET_USER = gql`
query {
    user {
        id
        login
      }
 }
`

export const User = () => {
    const {error, data, loading} = useQuery(GET_USER)

    if (error) {
        console.log(error)
        return <div></div>
    } 

    if (loading) return <div>Loading...</div>
    return (
       <div>
            <h1 className='text-3xl ml-4'>Welcome, {data.user[0].login}!</h1>
       </div>
    )
}
