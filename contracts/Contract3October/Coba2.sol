// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

contract Coba2 {
    address public owner = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;

    string[] public name;
    mapping(string => uint256) public nameIndex;

    function addName(string calldata _name) external {
        nameIndex[_name] = nameLength();
        name.push(_name);
    }

    function nameLength() public view returns(uint256) {
        return name.length;
    }

    function isOwner() internal view {
        require(msg.sender == owner, "unauthorized");
    }

    function isNameExist(string calldata _name) public view returns(bool){
        if (name.length == 0) {
            return false;
        }
        
        uint256 _nameIndex = nameIndex[_name]; // dapat index
        string memory _fetchName = name[_nameIndex];

        return keccak256(bytes(_fetchName)) == keccak256(bytes(_name));
    }

    function removeName(string calldata _name) external {
        isOwner();
        
        require(name.length > 0, "no list");
        require(isNameExist(_name), "not found");

        uint256 indexToRemove = nameIndex[_name];
        string memory nameToMove = name[nameLength() - 1];

        name[indexToRemove] = nameToMove;
        nameIndex[nameToMove] = indexToRemove;

        delete nameIndex[_name];
        name.pop();
    }
}