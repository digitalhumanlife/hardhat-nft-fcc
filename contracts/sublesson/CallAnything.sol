//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract CallAnything {
    address public s_address;
    uint256 public s_amount;

    function transfer(address someAddress, uint256 amount) public {
        s_address = someAddress;
        s_amount = amount;
    }

    function getSelctorOne() public pure returns (bytes4 selector) {
        selector = bytes4(keccak256(bytes("transfer(address,uint256")));
    }

    function getDataToCallTransfer(
        address someAddress,
        uint256 amount
    ) public pure returns (bytes memory) {
        return abi.encodeWithSelector(getSelctorOne(), someAddress, amount);
    }
}
