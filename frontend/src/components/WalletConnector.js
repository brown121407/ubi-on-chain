import { useContext, useEffect, useState } from "react";
import { UBIContext } from "./UBIContextProvider";

const WalletConnector = () => {
    const [address, setAddress] = useState();

    const { provider, metamask } = useContext(UBIContext);

    useEffect(() => {
        (async () => {
            if (provider) {
                const accounts = await provider.listAccounts();
                if (accounts.length > 0) {
                    const signer = provider.getSigner();
                    setAddress(await signer.getAddress());
                }

                metamask.on('accountsChanged', async (accounts) => {
                    if (accounts.length > 0) {
                        const signer = provider.getSigner();
                        setAddress(await signer.getAddress());
                    } else {
                        setAddress(undefined);
                    }
                });
            }
        })();
    }, []);

    const connectWallet = async () => {
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setAddress(await signer.getAddress());
    };

    return (
        <div>
            { !provider
            ? <p>Your browser doesn't have Metamask installed. 😢</p>
            : (address
                ? <p className="text-ellipsis">Connected: { address }</p>
                : <button className="button" onClick={connectWallet}>Connect Wallet</button>
                )
            }
        </div>
    );
}

export default WalletConnector;