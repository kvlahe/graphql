
import { Profile } from "./pages/profile/profile";
import { SignIn } from "./pages/signIn/signin";
import { BrowserRouter as Router, useRoutes, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

function App() {
  const cookies = new Cookies();
  const token = cookies.get('token');



  let element = token ? <Profile /> : <SignIn />;
  let routes = useRoutes([
    { path: '/', element: <SignIn /> },
    { path: '/profile', element: element },
  ]);

  return routes
}

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;