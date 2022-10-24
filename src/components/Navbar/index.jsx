import "./styles.css";

import { Link } from "react-router-dom";
import { useUser } from "../../context/user.context";

function Navbar() {
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider's `value` prop
  // const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const { user, logout } = useUser();

  return (
    <nav>
      <Link to='/'>
        <button>Home</button>
      </Link>

      {user && (
        <>
          <button onClick={logout}>Logout</button>

          <Link to='/profile'>
            <button>Profile</button>
            {/* <img src="https://picsum.photos/id/402/200/300" style={{ width: 50, height: 50, borderRadius: 25}} alt="profile" /> */}
          </Link>

          {/* <span>{user && user.name}</span> */}
        </>
      )}

      {!user && (
        <>
          <Link to='/signup'>
            {" "}
            <button>Sign Up</button>{" "}
          </Link>
          <Link to='/login'>
            {" "}
            <button>Login</button>{" "}
          </Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
