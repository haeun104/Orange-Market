import { NavLink } from "react-router-dom";

const MyMarketList = () => {
  return (
    <ul className="sm:flex sm:space-x-4 sm:flex-wrap">
      <NavLink
        to="/my-favorite"
        className={({ isActive }) =>
          isActive ? "font-bold text-blue-500" : undefined
        }
      >
        <li>My Favorite</li>
      </NavLink>
      <NavLink
        to="/sales-history"
        className={({ isActive }) =>
          isActive ? "font-bold text-blue-500" : undefined
        }
      >
        <li>Sales History</li>
      </NavLink>
      <NavLink
        to="/purchase-history"
        className={({ isActive }) =>
          isActive ? "font-bold text-blue-500" : undefined
        }
      >
        <li>Purchase History</li>
      </NavLink>
      <NavLink
        to="/purchase-request"
        className={({ isActive }) =>
          isActive ? "font-bold text-blue-500" : undefined
        }
      >
        <li>Purchase Request Status</li>
      </NavLink>
    </ul>
  );
};

export default MyMarketList;
