// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "./ScoreCalc.sol";

contract Profile {
    using ScoreCalc for uint256;
    uint256 public constant minScore = 75;

    struct Score {
        uint128 subjectIndex;
        uint128 score;
        string subjectName;
    }
    mapping(address => Score[]) public userScore;
    mapping(address => mapping(string => uint256)) public userSubjectIndex;

    address[] public owner;
    mapping(address => uint256) public ownerIndex;

    modifier onlyOwner {
        uint256 _ownerIndex = ownerIndex[msg.sender];

        require(owner[_ownerIndex] == msg.sender, "unauthorized");
        _;
    }

    constructor(address _owner){
        owner.push(_owner);
    }

    function addUser(
        address _user,
        string calldata _subjectName,
        uint256 _score
    ) public onlyOwner {
        uint256 index = getUserScoreLength(_user);
        userSubjectIndex[_user][_subjectName] = index;

        userScore[_user].push(Score({
            subjectIndex: uint128(index),
            subjectName: _subjectName,
            score: uint128(_score)
        }));
    }

    function isUserExist(address _user) public view returns(bool){
        return userScore[_user].length > 0;
    }

    function isUserSubjectExist(
        address _user,
        string calldata _subjectName
    ) public view returns(bool){
        if(getUserScoreLength(_user) == 0) return false;

        uint256 subjectIndex = userSubjectIndex[_user][_subjectName];

        return keccak256(bytes(userScore[_user][subjectIndex].subjectName)) == keccak256(bytes(_subjectName));
    }

    function removeSubject(
        address _user,
        string calldata _subjectName
    ) public onlyOwner {
        require(isUserSubjectExist(_user, _subjectName), "not found");

        uint256 subjectIndexToRemove = userSubjectIndex[_user][_subjectName];
        Score memory userSubjectDataToMove = userScore[_user][getUserScoreLength(_user) - 1];

        userScore[_user][subjectIndexToRemove] = userSubjectDataToMove;
        userScore[_user][subjectIndexToRemove].subjectIndex = uint128(subjectIndexToRemove);

        delete userSubjectIndex[_user][_subjectName];
        userScore[_user].pop();
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