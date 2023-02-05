import React, { useState, useEffect } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftMarkeplaceAbi from "../constants/NftMarketplace.json";
import basicNftAbi from "../constants/BasicNft.json";
import Image from "next/image";
import { Card } from "@web3uikit/web3";
import { ethers } from "ethers";

const truncateString = (fullStr, strLen) => {
  if (fullStr.length <= strLen) return fullStr;

  const separator = "...";
  const separatorLength = separator.length;
  const charsToShow = strLen - separatorLength;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return (
    fullStr.substring(0, frontChars) +
    separator +
    fullStr.substring(fullStr.length - backChars)
  );
};

const NFTBox = ({ price, nftAddress, tokenId, marketplaceAddress, seller }) => {
  const { isWeb3Enabled, account } = useMoralis();
  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");

  console.log(tokenId);

  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: basicNftAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: {
      tokenId: tokenId,
    },
  });

  async function updateUI() {
    //get token URI
    //using the image from tokenURI to get the image
    const tokenURI = await getTokenURI();
    console.log(`the token URI is ${tokenURI}`);
    if (tokenURI) {
      //IPFS Gateway: a server that will return IPFS files from a "normal" URL
      const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      const tokenURIREsponse = await (await fetch(requestURL)).json();
      const imageURI = tokenURIREsponse.imageURI;
      const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImageURI(imageURIURL);
      setTokenName(tokenURIREsponse.name);
      setTokenDescription(tokenURIREsponse.description);
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const isOwnedByUser = seller === account || seller == undefined;
  const formattedSellerAddress = isOwnedByUser
    ? "you"
    : truncateString(seller || "", 15);

  return (
    <div>
      <div>
        {imageURI ? (
          <Card title={tokenName} description={tokenDescription}>
            <div className="p-2">
              <div className="flex flex-col items-end gap-2">
                <div>#{tokenId}</div>
                <div className="italic text-sm">Owned by {seller}</div>
                <Image
                  loader={() => imageURI}
                  src={imageURI}
                  height="200"
                  widht="200"
                />
                <div className="font-bold">
                  {ethers.utils.formatUnits(price, "ether")}
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div>:Loading</div>
        )}
      </div>
    </div>
  );
};

export default NFTBox;
