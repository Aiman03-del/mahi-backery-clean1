import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { IoArrowBackOutline } from "react-icons/io5";
import { MdOutlineBarChart } from "react-icons/md";
import { BsCalendar2Day, BsPlusSquare } from "react-icons/bs";
import { GiReceiveMoney } from "react-icons/gi";
import logo from "../assets/logo.png";
import useAuth from "../hooks/useAuth";

const Sidebar = ({ onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dbUser, user } = useAuth() || {};
  const role = dbUser?.role || user?.role || "user";
  const displayName = dbUser?.displayName || user?.displayName || "User Name";
  const email = dbUser?.email || user?.email || "user@email.com";
  const photoURL = dbUser?.photoURL || user?.photoURL || "";

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sticky top-0 h-screen w-64 bg-white shadow-xl flex flex-col justify-between py-8 px-6 border-r border-gray-100
    max-h-screen
    ">
      {/* Top: Logo & Title */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            <img src={logo} alt="Logo" className="h-10 w-14 object-contain" />
          </div>
          <span className="text-2xl font-extrabold text-secondary tracking-wide whitespace-nowrap">
            Mahi Bakery
          </span>
        </div>

        {/* Home & Back Icons Row */}
        <div className="flex gap-2 mb-4">
          <Link
            to="/"
            onClick={() => onNavigate && onNavigate()}
            className={`flex items-center justify-center w-full px-0 py-3 rounded-lg text-base font-medium transition group
              ${
                isActive("/")
                  ? "bg-primary/30 text-accent font-bold"
                  : "text-secondary hover:bg-primary/20 hover:text-accent"
              }
            `}
            style={{ flex: 1 }}
            title="Home"
          >
            <AiOutlineHome
              className={`text-2xl mx-auto ${
                isActive("/") ? "text-accent" : "group-hover:text-accent"
              }`}
            />
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-full px-0 py-3 rounded-lg text-base font-medium transition group text-secondary hover:bg-primary/20 hover:text-accent"
            style={{ flex: 1 }}
            title="Back"
          >
            <IoArrowBackOutline className="text-2xl mx-auto" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 min-h-0">
          <ul className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-300px)] pr-2 custom-scrollbar">
            <li>
              <Link
                to="/dashboard/statistics"
                onClick={() => onNavigate && onNavigate()}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition group
                  ${
                    isActive("/dashboard/statistics")
                      ? "bg-primary/30 text-accent font-bold"
                      : "text-secondary hover:bg-primary/20 hover:text-accent"
                  }
                `}
              >
                <MdOutlineBarChart
                  className={`text-xl ${
                    isActive("/dashboard/statistics")
                      ? "text-accent"
                      : "group-hover:text-accent"
                  }`}
                />
                Statistics
              </Link>
            </li>

            {/* Only show below menus for admin */}
            {role === "admin" && (
              <>
                <li>
                  <Link
                    to="/dashboard/daily-calculation"
                    onClick={() => onNavigate && onNavigate()}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition group
                      ${
                        isActive("/dashboard/daily-calculation")
                          ? "bg-primary/30 text-accent font-bold"
                          : "text-secondary hover:bg-primary/20 hover:text-accent"
                      }
                    `}
                  >
                    <BsCalendar2Day
                      className={`text-xl ${
                        isActive("/dashboard/daily-calculation")
                          ? "text-accent"
                          : "group-hover:text-accent"
                      }`}
                    />
                    Daily Calculation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/add-food-item"
                    onClick={() => onNavigate && onNavigate()}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition group
                      ${
                        isActive("/dashboard/add-food-item")
                          ? "bg-primary/30 text-accent font-bold"
                          : "text-secondary hover:bg-primary/20 hover:text-accent"
                      }
                    `}
                  >
                    <BsPlusSquare
                      className={`text-xl ${
                        isActive("/dashboard/add-food-item")
                          ? "text-accent"
                          : "group-hover:text-accent"
                      }`}
                    />
                    Add Food Item
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/manage-items-ingredients"
                    onClick={() => onNavigate && onNavigate()}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition group
                      ${
                        isActive("/dashboard/manage-items-ingredients")
                          ? "bg-primary/30 text-accent font-bold"
                          : "text-secondary hover:bg-primary/20 hover:text-accent"
                      }
                    `}
                  >
                    <BsPlusSquare
                      className={`text-xl ${
                        isActive("/dashboard/manage-items-ingredients")
                          ? "text-accent"
                          : "group-hover:text-accent"
                      }`}
                    />
                    Manage Items & Ingredients
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/daily-net-expense"
                    onClick={() => onNavigate && onNavigate()}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition group
                      ${
                        isActive("/dashboard/daily-net-expense")
                          ? "bg-primary/30 text-accent font-bold"
                          : "text-secondary hover:bg-primary/20 hover:text-accent"
                      }
                    `}
                  >
                    <GiReceiveMoney
                      className={`text-xl ${
                        isActive("/dashboard/daily-net-expense")
                          ? "text-accent"
                          : "group-hover:text-accent"
                      }`}
                    />
                    Daily Net Expense
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/salesman-order"
                    onClick={() => onNavigate && onNavigate()}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition group
                      ${
                        isActive("/dashboard/salesman-order")
                          ? "bg-primary/30 text-accent font-bold"
                          : "text-secondary hover:bg-primary/20 hover:text-accent"
                      }
                    `}
                  >
                    <BsPlusSquare
                      className={`text-xl ${
                        isActive("/dashboard/salesman-order")
                          ? "text-accent"
                          : "group-hover:text-accent"
                      }`}
                    />
                    Salesman Order
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      {/* Bottom: user info only */}
      <div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10">
          {photoURL ? (
            <img
              src={photoURL}
              alt={displayName}
              className="w-12 h-12 rounded-full object-cover shadow"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-bold text-lg shadow">
              {displayName?.[0] || "U"}
            </div>
          )}
          <div>
            <div className="font-semibold text-secondary leading-tight">
              {displayName}
            </div>
            <div className="text-xs text-gray-400">{email}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
