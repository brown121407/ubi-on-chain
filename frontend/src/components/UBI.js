import { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import './UBI.css';
import { UBIContext } from './UBIContextProvider';
import WalletConnector from './WalletConnector';
import { Toaster } from 'react-hot-toast';
import { parseEther } from 'ethers/lib/utils';
import Spinner from './Spinner';

export default function UBI() {
    const { contract, networks } = useContext(UBIContext);
    const [ donationAmount, setDonationAmount ] = useState(0);
    const [ isLoading, setIsLoading ] = useState(false);

    const changeDonationAmount = (e) => {
        setDonationAmount(e.target.value);
    }

    const subscribe = async () => {
        setIsLoading(true);
        try {
            await contract.subscribe();
        } catch (err) {
            console.error(err);
            toast.error(err.error ? err.error.message : err.message);
        }
        setIsLoading(false);
    }

    const unsubscribe = async () => {
        setIsLoading(true);
        try {
            await contract.unsubscribe();
        } catch (err) {
            console.error(err);
            toast.error(err.error ? err.error.message : err.message);
        }
        setIsLoading(false);
    }

    const donate = async (ev) => {
        ev.preventDefault();

        setIsLoading(true);
        try {
            const txn = await contract.donate({value: parseEther(donationAmount)});
            await txn.wait();
        } catch (err) {
            console.error(err);
            toast.error(err.error ? err.error.message : err.message);
        }

        setIsLoading(false);
    }

    return (
        <main className="container mx-auto my-4 font-mono">
            <Toaster/>

            <h1 className="text-center text-4xl font-bold">
                <span className="revolutionary">☭</span>
                &nbsp;On-chain UBI&nbsp;
                <span className="revolutionary">☭</span>
            </h1>

            <div className="my-8">
                <blockquote className="text-xl">From each according to his ability, to each according to his needs.</blockquote>
                <p className="text-right">Karl Marx, <i>Critique of the Gotha Programme</i></p>
            </div>

            <div className="flex flex-col my-8">
                <h2 className="font-bold text-3xl mb-4">Network &amp; Wallet</h2>
                <div className="flex flex-row gap-1">
                {/* <select className="input grow">
                    { networks.map((network, i) => {
                        return <option key={i} value={network.chainId}>{network.name}</option>
                    })}
                </select> */}
                <WalletConnector/>
                </div>
            </div>

            <div className="flex flex-col my-8">
                <h2 className="font-bold text-3xl mb-4">Benefit from public funds</h2>

                <p>Once subscribed, you'll receive:</p>
                <ul className="list-disc pl-4 mt-1 mb-2">
                    { networks.map((network, i) => {
                        return <li key={i}>{network.sum} {network.coin} / minute from {network.name}</li>
                    })}
                </ul>

                <div className="flex flex-row flex-wrap gap-2">
                <button className="button grow" onClick={subscribe} disabled={isLoading}>
                    { isLoading && <Spinner/> }
                    Subscribe
                </button>
                <button className="button grow" onClick={unsubscribe} disabled={isLoading}>
                    { isLoading && <Spinner/> }
                    Unsubscribe
                </button>
                </div>
            </div>

            <div className="my-8">
                <h2 className="font-bold text-3xl mb-4">Help your comrades</h2>

                <form className="flex flex-col gap-2" onSubmit={donate}>
                    <div className="flex flex-row gap-2 flex-wrap items-center">
                        <label className="text-lg">Sum:</label>
                        <input className="input grow" type={'number'} step={0.0001} onChange={changeDonationAmount}/>
                    </div>
                    <button className="button" disabled={isLoading}>
                        { isLoading && <Spinner/> }
                        Donate
                    </button>
                </form>
            </div>
        </main>
    );
}
