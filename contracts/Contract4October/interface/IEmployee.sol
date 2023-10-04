// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

interface IEmployee {
    function employeeLength() external view returns (uint256);

    function isEmployeeExist(address _employee) external view returns (bool);

    function addEmployee(
        address _employee,
        string calldata _name,
        string calldata _position
    ) external;
}
