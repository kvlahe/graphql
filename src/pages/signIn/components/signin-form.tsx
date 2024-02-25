import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { useNavigate } from 'react-router-dom';
import { Button } from 'components/ui/button';

import { useForm } from 'react-hook-form';
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from 'components/ui/input';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'universal-cookie';

const formSchema = z.object({
    email: z.string().email().optional(),
    username: z.string().optional(),
    password: z.string(),
}).refine(data => data.email || data.username, {
    message: "Either email or username must be provided",
    path: ['email', 'username']
});


export const SignInForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null)

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { username, password } = values;
        const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

        try {
            setLoading(true);
            const signinResponse = await axios.post('https://01.kood.tech/api/auth/signin', {}, {
                headers: {
                    'Authorization': basicAuth
                }
            });

            const jwt = signinResponse.data;
            const cookies = new Cookies()
            cookies.set('token', jwt, {
                secure: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7
            })

            const userProgress = {
                query: `
                    {
                        progress {
                            id
                            userId
                            objectId
                            grade
                            createdAt
                            updatedAt
                            path
                        }
                    }
                `
            };

            const graphqlResponse = await axios.post('https://01.kood.tech/api/graphql-engine/v1/graphql', userProgress, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                }
            });
            if (graphqlResponse) {
                setData(graphqlResponse.data)
                navigate('/profile');

            } else {
                toast.error("Graphql request failed")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            
            setLoading(false);
        }
    }

    return (
        <div className='space-y-4 py-2 pb-4'>
            <Form {...form}>
                <FormDescription className='text-white text-2xl text-center font-bold mb-5'>
                    Sign in to your account
                </FormDescription>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="username"
                        defaultValue=''
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Username
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder='Username' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        defaultValue=''
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Password
                                </FormLabel>
                                <FormControl>
                                    <Input type='password' placeholder='Password' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='pt-6 flex flex-col'>
                        <Button className='w-full mb-2' variant="secondary" disabled={loading} type='submit'>Sign In</Button>
                        <a href="https://01.kood.tech/" target="_blank" rel="noopener noreferrer">
                            <Button className='w-full text-white' variant="link" disabled={loading} type='button'>
                                Forgot Password?
                            </Button>
                        </a>
                    </div>
                    <Toaster />
                </form>
            </Form>
        </div>
    )
}

