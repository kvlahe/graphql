import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from "middleware";
import Cookies from "universal-cookie";
import { Navbar } from 'components/ui/navbar';
import { User } from './components/user';
import { Experience } from './components/experience';
import { Audits } from './components/audits';
import  {ProgressChart}  from './components/progressChart';
import  PassFail  from './components/pass-fail';


export const Profile = () => {

  function handleLogout() {
    new Cookies().remove('token');
    navigate('/');
  }

  const navigate = useNavigate();
  const token = new Cookies().get('token');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const result = await Auth(token);
      setUser(result);
      setLoading(false);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!loading && user === null) {
      navigate('/');
    }
  }, [user, navigate, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-white flex flex-col h-screen">
      <Navbar onLogout={handleLogout} />
      <div className='px-[6%] py-[4%] flex-grow m-auto'>
        <User />
        <div>
          <h1 className='mt-4 ml-4 2xl'>DIV 01 #190</h1>
        </div>
        <div className='flex flex-col lg:flex-row lg:pl-3 pl-0'>
          <div className='flex lg:flex-col items-center justify-center'>
            <Experience />
            <Audits />
          </div>
          <ProgressChart />
        </div>
        <PassFail/>
      </div>
    </div>
  )
}