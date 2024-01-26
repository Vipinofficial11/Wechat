import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Landing from "./components/Landing";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landing />,
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
