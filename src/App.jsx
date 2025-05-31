import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Homepage/Home";
import MainLayout from "./Layout/MainLayout";
import DashboardLayout from "./Layout/DashboardLayout";
import React, { Suspense } from "react";
import Statistics from "./Pages/DashboardPage/Statistics/Statistics";
import DailyNetExpense from "./Pages/DashboardPage/DailyNetExpense/DailyNetExpense";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./Pages/LoginPage/Login";
import Register from "./Pages/RegisterPage/Register";
import AddFoodItem from "./Pages/DashboardPage/AddFoodItem/AddFoodItem";
const DailyCalculation = React.lazy(() =>
  import("./Pages/DashboardPage/DailyCalculation/DailyCalculation")
);
const SalesmanOrder = React.lazy(() =>
  import("./Pages/DashboardPage/SalesmanOrder/SalesmanOrder")
);
const ManageItemsIngredients = React.lazy(() =>
  import("./Pages/DashboardPage/ManageItemsIngredients/ManageItemsIngredients")
);

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Statistics />} />
          <Route path="statistics" element={<Statistics />} />
          <Route
            path="daily-calculation"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <DailyCalculation />
              </Suspense>
            }
          />
          <Route
            path="daily-net-expense"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <DailyNetExpense />
              </Suspense>
            }
          />
          <Route path="add-food-item" element={<AddFoodItem />} />
          <Route
            path="manage-items-ingredients"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ManageItemsIngredients />
              </Suspense>
            }
          />
          <Route
            path="salesman-order"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <SalesmanOrder />
              </Suspense>
            }
          />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/services" element={<Services />} />
      <Route path="/portfolio" element={<Portfolio />} /> */}
      </Routes>
    </>
  );
}

export default App;

/*
  Note:
  If you get a 404 Not Found error when reloading or directly accessing /dashboard or any nested route,
  make sure your development or production server is configured to fallback to index.html for unknown routes.
  For example, in Vite, add this to vite.config.js:
    server: { historyApiFallback: true }
  For other servers, search for "SPA history fallback" for your stack.
*/
