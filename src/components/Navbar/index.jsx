import "./styles.css";

import { Avatar } from "primereact/avatar";
import { Link, useNavigate } from "react-router-dom";

import { useUser } from "../../context/user.context";

function Navbar() {
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider's `value` prop
  // const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const { user, logout } = useUser();
  const navigate = useNavigate();

  return (
    <nav className="flex fixed bg-primary" style={{ zIndex: 1100 }}>
      <div className="ml-2">
        <Link to={user ? "/dashboard" : "/"}>
          <h1>Bowling Bot</h1>
        </Link>
      </div>
      <div className="ml-auto my-auto">
        <div className="flex">
          {user && (
            <>
              <Avatar
                image={
                  user?.discord?.avatar
                    ? user.discord.avatar
                    : "/images/discord-default.png"
                }
                shape="circle"
                className="my-auto"
                onClick={() => {
                  navigate("/profile");
                }}
              />
              <p className="ml-3">
                {user?.discord?.username ? user.discord.username : user.email}
              </p>
              <span
                className=" ml-4 mr-3 my-auto cursor-pointer"
                onClick={logout}
              >
                <i className="pi pi-sign-out logout"></i>
              </span>
            </>
          )}
          {!user && (
            <>
              <span
                className="mr-3 my-auto cursor-pointer"
                onClick={() => {
                  navigate("/login");
                }}
              >
                <i className="pi pi-sign-in logout"></i>
              </span>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
