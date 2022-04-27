import { useContext } from 'react';
import toast from 'react-hot-toast';
import './UBI.css';
import { UBIContext } from './UBIContextProvider';
import WalletConnector from './WalletConnector';

export default function UBI() {
    const { contract, networks } = useContext(UBIContext);

    const subscribe = async () => {
        // try {
            await contract.subscribe();
        // } catch (e) {
        //     // toast(e.toString());
        // }
    }

    const unsubscribe = async () => {
        await contract.unsubscribe();
    }

    const donate = async (ev) => {
        ev.preventDefault();
    }

    return (
        <main className="container mx-auto my-4 font-mono">
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
            {/* <button className="button">Connect Wallet</button> */}
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
            <button className="button grow" onClick={subscribe}>Subscribe</button>
            <button className="button grow" onClick={unsubscribe}>Unsubscribe</button>
            </div>
        </div>

        <div className="my-8">
            <h2 className="font-bold text-3xl mb-4">Help your comrades</h2>

            <form className="flex flex-col gap-2" onSubmit={donate}>
            <div className="flex flex-row gap-2 flex-wrap items-center">
                <label className="text-lg">Sum:</label>
                <input className="input grow"/>
            </div>
            <button className="button">Donate</button>
            </form>
        </div>
        </main>
    );
}
