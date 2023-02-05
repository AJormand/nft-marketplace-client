import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import NFTBox from "@/components/NFTBox";
import networkMapping from "../constants/networkMapping.json";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { useQuery } from "@apollo/client";
import GET_ACTIVE_ITEMS from "@/constants/subgraphQueries";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  //how do we show recently listed NFTs??
  //We cant store it in array of the contract as it would be too gass inefecient
  //we cant use the mapping as we would need to go thorough all the addresses
  //we can use the EVENTS data which is stored on chain but the contracts cant access it but the offchain services can
  //we will index the events off-chain and then read from our database
  //setup a server that will listen for those events to be fired and will add them to a database query
  //Isnt that centralized?
  //not necessarily - Moralis does it in a centralized way (better speed etc) / TheGraph could do it in a decentralized way
  const { isWeb3Enabled, chainId } = useMoralis();
  console.log(chainId);
  const chainString = chainId ? parseInt(chainId).toString() : "31337";
  const marketplaceAddress = networkMapping[chainString].NftMarketplace[0];
  const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS);

  return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
      <div className="flex flex-wrap">
        {isWeb3Enabled ? (
          loading || !listedNfts ? (
            <div>Loading...</div>
          ) : (
            listedNfts.activeItems.map((nft) => {
              console.log(nft);
              const { price, nftAddress, tokenId, seller } = nft;
              return (
                <NFTBox
                  price={price}
                  nftAddress={nftAddress}
                  tokenId={tokenId}
                  marketplaceAddress={marketplaceAddress}
                  seller={seller}
                  key={`${nftAddress}${tokenId}`}
                />
              );
            })
          )
        ) : (
          <div>Web3 Currently Not Enabled</div>
        )}
      </div>
    </div>
  );
}
