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
