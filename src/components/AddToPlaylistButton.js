import React, { useState } from "react";
import "./AddToPlaylistButton.css";

import MoreVertRoundedIcon from "@material-ui/icons/MoreVertRounded";

function AddToPlaylistButton(props) {
  const [open, setOpen] = useState();

  return (
    <div className="playlist_dropdown_button">
      <MoreVertRoundedIcon href="#" onClick={() => setOpen(!open)} />
      {open && props.children}
    </div>
  );
}

export default AddToPlaylistButton;
