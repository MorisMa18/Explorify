"use client";

import { useSession, signOut } from "next-auth/react";
import { Button, Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";
import StatusPill from "../ui/StatusPill";

function Header() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="relative z-20 flex h-[74px] flex-none items-center justify-between px-11">
      <div className="flex items-center gap-[30px]">
        <div className="flex items-center gap-[11px]">
          <div className="size-[30px] flex-none rounded-swatch" data-role="logo-mark" />
          <span className="font-display text-[19px] font-semibold tracking-[-0.02em]">
            Explorify
          </span>
        </div>

        <nav className="flex items-center gap-1 rounded-chip p-1">
          <span className="rounded-[9px] px-4 py-[7px] text-sm font-medium" aria-current="page">
            Home
          </span>
        </nav>
      </div>

      <div className="flex items-center gap-[18px]">
        <StatusPill>Connected to Spotify</StatusPill>

        {/* The design shows no logout control; hanging it off the avatar
            keeps signOut reachable without inventing new chrome. */}
        <MenuTrigger>
          <Button
            aria-label={user?.name ? `Account menu for ${user.name}` : "Account menu"}
            className="flex items-center gap-2.5"
          >
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt=""
                width={32}
                height={32}
                className="size-8 flex-none rounded-full object-cover"
              />
            ) : (
              <span className="size-8 flex-none rounded-full" />
            )}
            <span className="text-sm font-medium">{user?.name}</span>
          </Button>
          <Popover>
            <Menu onAction={() => signOut()}>
              <MenuItem id="signout">Log out</MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>
      </div>
    </header>
  );
}

export default Header;
