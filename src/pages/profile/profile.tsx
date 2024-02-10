import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from "middleware";
import Cookies from "universal-cookie";
import { Navbar } from 'components/ui/navbar';

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
  }, [token]);

  useEffect(() => {
    if (!loading && user === null) {
      navigate('/');
    }
  }, [user, navigate, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-white">
      <Navbar onLogout={handleLogout}/>
      <div>Profile</div>
    </div>
  )
}