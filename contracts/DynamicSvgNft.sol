// Dynamic SVG NFT
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "base64-sol/base64.sol";

contract DynamicSvgNft is ERC721 {
    // mint token
    // store the image files on somewhere
    // change the images X and Y, depending on input

    uint256 private s_tokenCounter;
    string private i_lowImageURI;
    string private i_highImageURI;
    string private constant base64EncodedSvgPrefix = "data:iamge/svg+xml;base64,";

    constructor(string memory lowSvg, string memory highSvg) ERC721("dynamicSvg", "DSN") {
        s_tokenCounter = 0;
    }

    function svgToImageURI(string memory svg)public pure returns(string memory){
        string memory svgBase64Encoded = Base64.encode(byte(string(abi.encodePacked(svg))))
        return string(abi.encodedPacked(base64EncodedSvgPrefix, svgBase64Encoded))
    }

    function mintNft() public {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter += 1;
    }
}
