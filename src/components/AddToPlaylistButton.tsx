"use client";

import { ReactNode, useState } from "react";
import "./AddToPlaylistButton.css";

import MoreVertRoundedIcon from "@material-ui/icons/MoreVertRounded";

interface AddToPlaylistButtonProps {
  children: ReactNode;
}

function AddToPlaylistButton(props: AddToPlaylistButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="playlist_dropdown_button">
      <MoreVertRoundedIcon href="#" onClick={() => setOpen(!open)} />
      {open && props.children}
    </div>
  );
}

export default AddToPlaylistButton;
