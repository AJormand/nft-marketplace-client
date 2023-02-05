import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import NFTBox from "@/components/NFTBox";

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

  return <>Hi!</>;
}
