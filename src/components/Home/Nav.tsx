import { useState } from "react";
import { Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../../src/firebase-config";
import Modal from "../Modal";

const Nav = () => {
  const [loggedInUser, setLoggedInUser] = useState({});
  const [openModal, setOpenModal] = useState(false);

  //Update user data whenever login status is changed
  onAuthStateChanged(auth, (currentUser) => {
    setLoggedInUser(currentUser);
  });

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("successfully logged out");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    alert("successfully logged out");
    // setOpenModal(true);
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <Disclosure as="nav" className="bg-white-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-black-400 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/" className="flex">
                      <img
                        className="h-8 w-auto size-5"
                        src="src\assets\logo_orange.png"
                        alt="company logo"
                      />
                      <h1 className="text-xl sm:text-2xl font-semibold">
                        Orange Market
                      </h1>
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      <div className="text-black-300 hover:bg-slate-200 rounded-md px-3 py-2 text-sm font-bold">
                        Products
                      </div>
                      {!loggedInUser && (
                        <>
                          <Link to="/login">
                            <div className="text-white hover:bg-slate-200 hover:text-black rounded-md px-3 py-2 text-sm font-medium bg-main-orange">
                              Login
                            </div>
                          </Link>
                          <Link to="/signup">
                            <div className="text-main-orange hover:bg-slate-200 hover:border-slate-200 hover:text-black rounded-md px-3 py-2 text-sm font-medium border-solid border-main-orange border-2">
                              Sign Up
                            </div>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {loggedInUser && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    {/* Profile dropdown */}

                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex">
                          <span>{loggedInUser.email}</span>
                        </Menu.Button>
                      </div>
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Your Profile
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Settings
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="/"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                              onClick={handleLogout}
                            >
                              Sign out
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </div>
                )}
              </div>
            </div>
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                <Link to="/">
                  <Disclosure.Button className="text-black-300 hover:bg-slate-200 block rounded-md px-3 py-2 text-base font-medium">
                    Products
                  </Disclosure.Button>
                </Link>
                {!loggedInUser && (
                  <>
                    <Link to="/login">
                      <Disclosure.Button className="text-black-300 hover:bg-slate-200 block rounded-md px-3 py-2 text-base font-medium">
                        Login
                      </Disclosure.Button>
                    </Link>
                    <Link to="/signup">
                      <Disclosure.Button className="text-black-300 hover:bg-slate-200 block rounded-md px-3 py-2 text-base font-medium">
                        Sign Up
                      </Disclosure.Button>
                    </Link>
                  </>
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <Modal
        openModal={openModal}
        setOpenModal={setOpenModal}
        message={"successfully logged out!"}
      />
    </>
  );
};

export default Nav;
