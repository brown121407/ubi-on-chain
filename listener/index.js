import { CronJob } from "cron";
import ethers from "ethers";
import env from "./environments/index.js";
import winston from "winston";
import { format } from "logform";
import dotenv from "dotenv";
import { createRequire } from "module";

dotenv.config();

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
        // TODO subscribe on other chains

        logger.info(`${subscriber} subscribed to ${contract.networkName}`);
    });

    contract.on("Unsubscribed", (subscriber, event) => {
        // TODO unsubscribe on other chains

        logger.info(`${subscriber} unsubscribed to ${contract.networkName}`);
    });
}

// TODO: Make the job run once per day and treat exceptions so it doesn't crash
const job = new CronJob('* * * * *', async function () {
    logger.info(new Date().toLocaleTimeString());
    let txns = contracts.map((contract) => contract.distribute());
    await Promise.all(txns);
});

logger.info("Starting cron job...");
job.start();