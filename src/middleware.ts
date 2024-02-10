import axios from 'axios';

export default async function Auth(token: string) {
    const user = {
        query: `
      {
        user {
          id
          login
        }
      }
    `,
    };

    try {
        const response = await axios.post("https://01.kood.tech/api/graphql-engine/v1/graphql", user, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data.data.user;
    } catch (error) {
        return null;
    }
}