"use client";

import { useSession, signOut } from "next-auth/react";
import "./Navbar.css";

import { Avatar } from "@material-ui/core";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";

function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="navbar">
      <div className="navbar__left">
        <h1> Explorify</h1>
        <h4> Home </h4>
      </div>

      <div className="navbar__right">
        <Avatar src={user?.image} />
        <p> {user?.name} </p>
        <ExitToAppRoundedIcon
          className="logoutIcon"
          titleAccess="Log out"
          onClick={() => signOut()}
        />
      </div>
    </div>
  );
}

export default Navbar;
