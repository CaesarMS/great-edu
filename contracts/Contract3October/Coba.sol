// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

library Calculator {
    function calcPercentage(
        uint256 numerator,
        uint256 denumerator
    ) public pure returns(uint256){
        return numerator * 100 / denumerator;
    }
}

contract Coba {
    using Calculator for uint256;

    // state variable atau storage variable
    enum Gender { Male, Female } // 0, 1 => index

    struct UserDetail {
        Gender userGender;
        uint256 score;
        address user;
        bool isPassed;
        string userName;
    }
    UserDetail public userDetail;
    // uint256 public balance;

    mapping(address => uint256) public balance;

    event UserAdded(address user);

    address public owner = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    modifier onlyOwner {
        require(msg.sender == owner); // if passed, then continue
        // pake: 20 gas used
        _;
    }

    function calcPercentage(
        uint256 numerator,
        uint256 denumerator
    ) public pure returns(uint256){
        // return Calculator.calcPercentage(numerator, denumerator);
        return numerator.calcPercentage(denumerator);
    }

    // 100 gas => 79 gas
    function setUser(
        uint256 _score,
        address _user,
        string calldata _userName,
        Gender _gender
    ) public onlyOwner {
        require(_score < 100, "more than 100"); // pake: 1 gas
        // sisa gas = 79 gas => kembali ke user

        _setUser(_score, _user, _userName, _gender);

        emit UserAdded(_user);
    }

    function addBalance(uint256 _balance) public {
        balance[msg.sender] += _balance;
    }

    function getBlockNumber() public view returns(uint256){
        return block.number;
    }

    // function setScore()....
    // fallback() external {

    // }

    // receive() external payable {
    //     // function untuk menerima ether
    // }

    function _setUser(
        uint256 _score,
        address _user,
        string calldata _userName,
        Gender _userGender
    ) internal {
        // internal code
        // 100 gas
        assert(userDetail.isPassed == false);

        userDetail = UserDetail({
            userGender: _userGender,
            score: _score,
            user: _user,
            isPassed: false,
            userName: _userName
        });


        uint256 minScore = 75;
        if(_score >= minScore) {
            userDetail.isPassed = true;
        } else if (_score == 0){
            revert("no score");
        }
    }

}

contract Coba2 is Coba {
    function callSetUser(
        uint256 _score,
        address _user,
        string calldata _userName,
        Gender _userGender
    ) public {
        _setUser(_score, _user, _userName, _userGender);
    }
}