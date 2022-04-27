import dotenv from "dotenv";
dotenv.config();

export default {
    networks: [
        {
            name: 'rinkeby',
            contractAddress: '0xC76920bEE436767698E7EB54E4Faa5c337898ADD',
            url: process.env.RINKEBY_URL
        },
        {
            name: 'mumbai',
            contractAddress: '0x76264875Ae9992098E4A5aa6492D5c8cDBf1109B',
            url: process.env.MUMBAI_URL
        },
        {
            name: 'bsct',
            contractAddress: '0x871Ae0DAC50759357B97fcA2810bF8B281aB507B',
            url: process.env.BSCT_URL
        },
    ]
};