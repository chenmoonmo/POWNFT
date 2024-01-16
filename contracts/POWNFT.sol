// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import 'truffle/console.sol';
import {ERC721Enumerable} from '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import {ERC721} from '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract POWNFT is ERC721Enumerable {
    //      MINING VARS
    uint BASE_COST = 0.000045 ether;
    uint BASE_DIFFICULTY = uint(0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff) / uint(300);
    uint DIFFICULTY_RAMP = 3;

    uint private lastDifficultyAdjustmentTime;
    uint tokensMinedThisHour;
    uint private constant TOKENS_PER_HOUR_TARGET = 100;

    bytes32[] TOKENS; //Array of all tokens [hash,hash,...]
    mapping(uint256 => uint256) WITHDRAWALS;

    constructor() ERC721('POW NFT', 'POW') {
        lastDifficultyAdjustmentTime = block.timestamp;
        tokensMinedThisHour = 0;
        mint(1, bytes32(0));
    }

    function _baseURI() internal pure override returns (string memory) {
        return 'https://www.pownftmetadata.com/t/';
    }

    //      MINING EVENTS
    event Mined(uint indexed _tokenId, bytes32 hash);
    event Withdraw(uint indexed _tokenId, uint value);

    //      MINING FUNCTIONS
    // 计算挖矿的难度系数
    function generationOf(uint _tokenId) private pure returns (uint generation) {
        for (generation = 0; _tokenId > 0; generation++) {
            _tokenId /= 2;
        }

        return generation - 1;
    }

    function getTokensMinedThisHour() public view returns (uint) {
        return tokensMinedThisHour;
    }

    // 返回token是否存在
    function isValidToken(uint256 _tokenId) internal view returns (bool) {
        return ownerOf(_tokenId) != address(0);
    }

    function hashOf(uint _tokenId) public view returns (bytes32) {
        require(isValidToken(_tokenId), 'invalid');
        return TOKENS[_tokenId - 1];
    }

    function mine(uint nonce) external payable {
        uint256 tokenId = TOKENS.length + 1;
        uint256 generation = generationOf(tokenId);
        bool isIn1Hour = block.timestamp - lastDifficultyAdjustmentTime < 1 hours;

        if (isIn1Hour) {
            if (tokensMinedThisHour > TOKENS_PER_HOUR_TARGET) {
                generation += 5;
            }
        }

        uint256 difficulty = BASE_DIFFICULTY / (DIFFICULTY_RAMP ** generation);

        if (generation > 13) {
            //Token 16384
            difficulty /= (tokenId - 2 ** 14 + 1);
        }

        uint cost = (2 ** generation - 1) * BASE_COST;

        bytes32 hash = keccak256(abi.encodePacked(msg.sender, TOKENS[tokenId - 2], nonce));
        require(hash < bytes32(difficulty), 'difficulty');
        console.log(msg.value);
        console.log(cost);
        require(msg.value >= cost, 'cost');

        // 动态调整难度
        if (isIn1Hour) {
            tokensMinedThisHour++;
        } else {
            lastDifficultyAdjustmentTime = block.timestamp;
            tokensMinedThisHour = 0;
        }

        mint(tokenId, keccak256(abi.encodePacked(hash, block.timestamp)));
        emit Mined(tokenId, hash);
    }

    function mint(uint tokenId, bytes32 hash) private {
        _update(msg.sender, tokenId, address(0));
        TOKENS.push(hash);
    }

    function withdraw(uint _tokenId, uint _withdrawUntil) public {
        payable(msg.sender).transfer(_withdraw(_tokenId, _withdrawUntil));
    }

    function _withdraw(uint _tokenId, uint _withdrawUntil) internal returns (uint) {
        require(isValidToken(_withdrawUntil), 'withdrawUntil_exist');

        require(ownerOf(_tokenId) == msg.sender, 'owner');
        require(_withdrawUntil > WITHDRAWALS[_tokenId], 'withdrawn');

        uint generation = generationOf(_tokenId);
        uint firstPayable = 2 ** (generation + 1);

        uint withdrawFrom = WITHDRAWALS[_tokenId];
        if (withdrawFrom < _tokenId) {
            withdrawFrom = _tokenId;

            if (withdrawFrom < firstPayable) {
                withdrawFrom = firstPayable - 1;
            }
        }

        require(_withdrawUntil > withdrawFrom, 'underflow');

        uint payout = BASE_COST * (_withdrawUntil - withdrawFrom);

        WITHDRAWALS[_tokenId] = _withdrawUntil;

        emit Withdraw(_tokenId, payout);

        return payout;
    }

    function withdrawMultiple(uint[] calldata _tokenIds, uint[] calldata _withdrawUntil) public {
        uint payout = 0;
        for (uint i = 0; i < _tokenIds.length; i++) {
            if (_withdrawUntil[i] > 0) {
                payout += _withdraw(_tokenIds[i], _withdrawUntil[i]);
            }
        }
        payable(msg.sender).transfer(payout);
    }
}
