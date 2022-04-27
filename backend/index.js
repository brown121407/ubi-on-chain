import dotenv from "dotenv";
dotenv.config();

import { CronJob } from "cron";
import ethers from "ethers";
import env from "./environments/index.js";
import winston from "winston";
import { format } from "logform";
import { createRequire } from "module";


const require = createRequire(import.meta.url);
const UBI = require("../contracts/artifacts/contracts/UBI.sol/UBI.json");

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: "info",
            format: format.combine(
                format.colorize(),
                format.timestamp(),
                format.align(),
                format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
            )
        })
    ]
});

const { networks } = env;

const contracts = networks.map((network, i) => {
    const provider = new ethers.providers.JsonRpcProvider(network.url);
    const wallet = new ethers.Wallet(process.env[`PRIVATE_KEY${i}`], provider);
    const contract = new ethers.Contract(network.contractAddress, UBI.abi, provider).connect(wallet);
    contract.networkName = network.name;

    return contract;
});

for (const contract of contracts) {
    // TODO only react to *new* events
    contract.on("Subscribed", (subscriber, event) => {
        logger.info(`${subscriber} subscribed to ${contract.networkName}`);
        logger.info("Adding cross chain subscriptions");
        contracts
            .filter((otherContract) => otherContract !== contract)
            .forEach(async (otherContract) => {
                try {
                    await otherContract.addCrossChainSubscription(subscriber, {gasLimit: 100000});
                } catch (e) {
                    logger.error(e.toString());
                }
            });
    });

    contract.on("Unsubscribed", (subscriber, event) => {
        logger.info(`${subscriber} unsubscribed to ${contract.networkName}`);
        logger.info("Removing cross chain subscriptions");

        contracts
            .filter((otherContract) => otherContract !== contract)
            .forEach(async (otherContract) => {
                try {
                    await otherContract.cancelCrossChainSubscription(subscriber, {gasLimit: 100000});
                } catch (e) {
                    logger.error(e.toString());
                }
            });
    });
}

// TODO: Make the job run once per day
const job = new CronJob('* * * * *', async function () {
    logger.info("Starting new distribution.");

    try {
        let txns = contracts.map((contract) => contract.distribute({gasLimit: 120000}));
        await Promise.all(txns);
        logger.info("Finished distribution successfully.");
    } catch (e) {
        logger.error(e.toString());
    }
});

logger.info("Starting cron job...");
job.start();