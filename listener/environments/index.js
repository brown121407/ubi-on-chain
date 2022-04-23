import dev from "./env.dev.js"
import test from "./env.test.js"

let env = dev;

if (process.env.UBI_ENV) {
    switch (process.env.UBI_ENV) {
        case "test":
            env = test;
            break;
        default:
            env = dev;
            break;
    }
}

export default env;