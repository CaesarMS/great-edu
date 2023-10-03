// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

library ScoreCalc {
    function isPassed(
        uint256 _score,
        uint256 _minScore
    ) external pure returns(bool) {
        return _score > _minScore;
    }
}

contract Profile {
    using ScoreCalc for uint256;
    uint256 public constant minScore = 75;

    struct Score {
        string subjectName;
        uint256 score;
    }
    mapping(address => Score[]) public userScore;
    address public owner;
    modifier onlyOwner {
        require(msg.sender == owner, "unauthorized");
        _;
    }

    constructor(address _owner){
        owner = _owner;
    }

    function addUser(
        address _user,
        string calldata _subjectName,
        uint256 _score
    ) public onlyOwner {
        userScore[_user].push(Score({
            subjectName: _subjectName,
            score: _score
        }));
    }

    function getUserScoreLength(address _user) public view returns(uint256){
        return userScore[_user].length;
    }

    function isUserPassed(
        address _user,
        uint256 _index
    ) external view returns(bool){
        require(getUserScoreLength(_user) > 0, "no record");

        // Score memory scoreDetail = userScore[_user][_index];
        uint256 _userScore = userScore[_user][_index].score;

        return _userScore.isPassed(minScore);
    }
}