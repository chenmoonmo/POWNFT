const ethers = require('ethers')

var POWNFTContract = artifacts.require('POWNFT')

const BN = ethers.BigNumber

contract('POWNFT', async (accounts) => {
  it('mine first token', async () => {
    const instance = await POWNFTContract.deployed('POW NFT', 'POW')
    const result = await instance.mine(BN.from('1224'), {
      from: accounts[0],
      value: BN.from(ethers.utils.parseEther('0.000045')),
    })
    console.log(result)
  })
})
