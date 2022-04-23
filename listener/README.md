# UBI Backend

Configuration is done in `environments/env.*.js`. For local development, check `env.dev.js`, which is tailored for testing with three Hardhat Networks running on ports 8545, 8546, 8547.

Each network in the configuration must have an associated environment variable called `PRIVATE_KEYx`, where `x` is its index (starting from 0). So, for the first network, you'd need to have `PRIVATE_KEY0`, for the second, `PRIVATE_KEY1` and so on. These variables hold the private keys for the backend's wallet on each chain.