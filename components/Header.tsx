import React, { ComponentProps, useContext } from "react";
import Link from "next/link";
import { GenerationsContext } from "./generations";
import { twMerge } from "tailwind-merge";
import { FaBurst } from "react-icons/fa6";
import {IoSettingsOutline} from 'react-icons/io5'

export default function Header() {
  const includedPages = [
    "Silhouette",
    "Zoom",
    "Pokedex",
    "Type",
    "Item",
    "Cries",
    "Abilities"
  ];
  const [width, setWidth] = React.useState<any>(700);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const {generations, setGenerations} = useContext(GenerationsContext);

  React.useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navLinks = (
    <>
      {includedPages.map((quiz) => (
        <NavLink key={quiz} href={`/Quiz/${quiz}`} setMenuOpen={setMenuOpen}>
          {quiz}
        </NavLink>
      ))}
      <NavLink href={'/Quiz/Moves'} setMenuOpen={setMenuOpen}>
        {/* <FaBurst/> */}
        Moves
      </NavLink>
      <NavLink href={"/Settings"} className="md:ml-auto" setMenuOpen={setMenuOpen}>
        <IoSettingsOutline />
        Settings
      </NavLink>
    </>
  );

  const isMobile = width <= 768;
  // const createNavItems = () =>
  //   includedPages.map((label) => (
  //     <h2
  //       className="nav-item text-2xl text-gray-400 hover:text-gray-300 py-5 font-bold"
  //       key={label}
  //       onClick={() => setMenuOpen(false)}
  //     >
  //       <style jsx>{`
  //         .nav-item {
  //           color: ${isMobile ? "#eeeeee" : "gray"};
  //           transition: 0.2s;
  //         }
  //         .nav-item:hover {
  //           color: #eeeeee;
  //           opacity: 1;
  //         }
  //       `}</style>

  //       <Link className="" href={`/Quiz/${label}`}>
  //         {label}
  //       </Link>
  //     </h2>
  //   ));

  return (
    <div className="Header">
      <style jsx>{`
        .Header {
          width: 100%;
          height: 100px;
          z-index: 10;
        }
        .nav-container {
          padding: 4px 30px;
          // padding-right: 0px;
          /*background-color: rebeccapurple;*/
          position: fixed;
          left: 0;
          right: 0;
          top: 0;
          display: flex;
          flex-direction: row;
          gap: 30px;
          z-index: 10;
        }

        button {
          border: none;
          background: none;
        }
        .hamburger {
          margin-left: auto;
          padding: 20px;
        }
        .hamburger-button {
        }

        .modal {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          background-color: black;
          transition: 0.3s;
        }
        .opened {
          transform: translateX(0%);
        }
        .closed {
          transform: translateX(100%);
        }

        .modal > button {
          align-self: flex-end;
          padding: 30px 30px;
          z-index: 5;
        }
        .mobile-menu {
          display: flex;
          flex-direction: column;
          align-items: center;
          align-self: center;
        }
      `}</style>

      <div className="nav-container">
        {isMobile ? (
          <div className="hamburger">
            <button
              className="hamburger-button"
              onClick={() => setMenuOpen(true)}
            >
              <img
                src="/menu-icon.svg"
                alt="menu icon"
                width="30px"
                height="30px"
              />
              {/* <h2>
                            Menu
                        </h2> */}
            </button>

            <div className={`modal ${menuOpen ? "opened" : "closed"}`}>
              <button onClick={() => setMenuOpen(false)}>X</button>
              <div className="mobile-menu overflow-auto w-full">{navLinks}</div>
            </div>
          </div>
        ) : (
          navLinks
        )}
        {}
      </div>
    </div>
  );
}

// function NavLinks() {
//   return <>

//   </>
// }

function NavLink(p: ComponentProps<typeof Link> & { setMenuOpen }) {
  return (
    <Link
      {...p}
      className={twMerge(
        "nav-item text-2xl text-gray-400 hover:text-gray-300 py-5 font-bold flex flex-row gap-2 items-center",
        p.className
      )}
      onClick={() => p.setMenuOpen(false)}
      // shallow={false}
    ></Link>
  );
}
