var POWNFTContract = artifacts.require('POWNFT')

module.exports = async function (deployer) {
  // deployment steps
  await deployer.deploy(POWNFTContract)
  const instance = await POWNFTContract.deployed('POW NFT', 'POW');
  console.log(instance.address)
}
