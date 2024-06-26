import { NavLink } from "react-router-dom";

const links = [
  { link: "/my-favorite", title: "My Favorite" },
  { link: "/my-products", title: "My Products For Sale" },
  { link: "/sales-history", title: "Sales History" },
  { link: "/purchase-history", title: "Purchase History" },
  { link: "/purchase-request", title: "Purchase Request Status" },
];

const MyMarketMenu = () => {
  return (
    <ul className="sm:flex sm:space-x-4 sm:flex-wrap mt-8 mb-16">
      {links.map((item, index) => (
        <NavLink
          key={index}
          to={item.link}
          className={({ isActive }) =>
            isActive
              ? "font-bold text-main-orange border-b-2 border-main-orange border-solid"
              : undefined
          }
        >
          <li>{item.title}</li>
        </NavLink>
      ))}
    </ul>
  );
};

export default MyMarketMenu;
