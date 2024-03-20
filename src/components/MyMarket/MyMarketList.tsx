import { NavLink } from "react-router-dom";

const links = [
  { link: "/my-favorite", title: "My Favorite" },
  { link: "/my-product", title: "My Products For Sale" },
  { link: "/sales-history", title: "Sales History" },
  { link: "/purchase-history", title: "Purchase History" },
  { link: "/purchase-request", title: "Purchase Request Status" },
];

const MyMarketList = () => {
  return (
    <ul className="sm:flex sm:space-x-4 sm:flex-wrap">
      {links.map((item, index) => (
        <NavLink
          key={index}
          to={item.link}
          className={({ isActive }) =>
            isActive
              ? "font-bold text-blue-500 border-b-2 border-blue-500 border-solid"
              : undefined
          }
        >
          <li>{item.title}</li>
        </NavLink>
      ))}
    </ul>
  );
};

export default MyMarketList;
