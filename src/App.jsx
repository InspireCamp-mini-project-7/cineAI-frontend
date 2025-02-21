import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import MovieDetail from "./pages/MovieDetail";
import Profile from "./pages/Profile";
import Search from "./pages/Search";

/* 라우터 설정 추가 */
const router = createBrowserRouter([
  {
    path: "/", // 기본 경로에서 Login 페이지로 이동
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/movie-detail",
    element: <MovieDetail />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/search",
    element: <Search />,
  },
]);

function App() {
  return (
    <section className='app-container'>
      <RouterProvider router={router} />
    </section>
  )
}

export default App
