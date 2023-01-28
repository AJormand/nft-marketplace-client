import React from "react";
import { ConnectButton } from "@web3uikit/web3";
import Link from "next/link";

const Header = () => {
  return (
    <nav>
      <Link href="/">NFT Marketplace</Link>
      <Link href="/sell-nft">Sell NFT</Link>
      <ConnectButton moralisAuth={false} />
    </nav>
  );
};

export default Header;
