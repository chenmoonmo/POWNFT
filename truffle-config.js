/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

const HDWalletProvider = require('@truffle/hdwallet-provider')
const path = require('path')
var privateKeys = ['member throw open hill place about column make average live husband admit']

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  migrations_directory: './migrations',
  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    docker: {
      provider: () => {
        return new HDWalletProvider(privateKeys, 'http://81.68.200.242:8848', 1, 2)
      },
      network_id: '*',
      gas: 12000000,
      gasPrice: 5000000000,
      skipDryRun: true,
    },
    local: {
      provider: () => {
        return new HDWalletProvider(privateKeys, 'http://127.0.0.1:8545', 3, 2)
      },
      network_id: '*',
      gas: 12000000,
      gasPrice: 50,
      skipDryRun: true,
    },
    kovan: {
      provider: () => {
        return new HDWalletProvider(privateKeys, 'https://kovan.infura.io/v3/0a62ec0dd46b4ee6b5f9d0536c3c106e', 1, 2)
      },
      network_id: '*',
      gas: 12000000,
      gasPrice: 5000000000,
      skipDryRun: true,
    },

    rinkeby: {
      provider: () => {
        return new HDWalletProvider(privateKeys, 'https://rinkeby.infura.io/v3/e1d5ca479d6a4764a0f94f8dc0d7dee8', 3, 2)
      },
      network_id: '*',
      gas: 12000000,
      gasPrice: 2000000000,
      skipDryRun: true,
    },
    goerli: {
      provider: () => {
        return new HDWalletProvider(privateKeys[0], 'https://goerli.infura.io/v3/bd1ec3759ffd44f7ad01260a98f19c92')
      },
      network_id: '*',
      gas: 12000000,
      gasPrice: 3000000,
      skipDryRun: true,
    },
    // "https://bsc-dataseed4.binance.org"

    //https://bsc-dataseed2.binance.org

    //https://silent-powerful-bush.bsc.quiknode.pro/fd1ffc86bed8d468ee5dd96e9cbc5d44f5f1e9bb/
    bsc: {
      provider: () => {
        return new HDWalletProvider(privateKeys, 'https://bsc-dataseed2.binance.org', 3, 2)
      },
      network_id: '56',
      gas: 12000000,
      gasPrice: 5000000000,
      allowUnlimitedContractSize: true,
      skipDryRun: true,
    },
    bsctest: {
      provider: () => {
        return new HDWalletProvider(privateKeys, 'https://data-seed-prebsc-1-s1.binance.org:8545/', 3, 2)
      },
      network_id: '*',
      gas: 12000000,
      gasPrice: 5000000000,
      allowUnlimitedContractSize: true,
      skipDryRun: true,
    },
    okex: {
      provider: () => {
        return new HDWalletProvider(privateKeys, 'https://exchainrpc.okex.org', 4, 1)
      },
      network_id: 66,
      gas: 12000000,
      gasPrice: 10000000000,
      allowUnlimitedContractSize: true,
      skipDryRun: true,
    },
    arbgoerli: {
      provider: () => {
        return new HDWalletProvider(privateKeys, 'https://goerli-rollup.arbitrum.io/rpc', 3, 2)
      },
      network_id: '*',
      gas: 120000000,
      gasPrice: 200000000,
      skipDryRun: true,
    },
    //https://endpoints.omniatech.io/v1/arbitrum/one/public
    //https://arb-mainnet-public.unifra.io
    arb: {
      provider: () => {
        return new HDWalletProvider(privateKeys, 'https://endpoints.omniatech.io/v1/arbitrum/one/public', 3, 2)
      },
      network_id: '*',
      gas: 120000000,
      gasPrice: 100000000,
      skipDryRun: true,
    },

    arbl3: {
      provider: () => {
        return new HDWalletProvider(privateKeys, 'http://192.168.31.50:8449', 5, 2)
      },
      network_id: '*',
      gas: 120000000,
      gasPrice: 100000000,
      skipDryRun: true,
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  plugins: ['truffle-plugin-verify', 'truffle-contract-size'],

  // Configure your compilers
  compilers: {
    solc: {
      version: '^0.8.20', // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: false,
          //  enabled: true,
          runs: 1000,
        },
        //  evmVersion: "byzantium"
      },
    },
  },
  solidityLog: {
    displayPrefix: ' :', // defaults to ""
    preventConsoleLogMigration: true, // defaults to false
  },
}
