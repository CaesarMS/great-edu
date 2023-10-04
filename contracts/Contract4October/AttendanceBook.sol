// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import './interface/IEmployee.sol';

contract AttendanceBook {
    uint256 public start;
    uint256 public end;
    uint256 public attendanceLength;
    address public employee;

    mapping(address => bool) public isAttend;

    modifier onlyEmployee() {
        require(
            IEmployee(employee).isEmployeeExist(msg.sender),
            'not an employee'
        );
        _;
    }

    constructor(address _employee, uint256 _start, uint256 _end) {
        employee = _employee;
        start = _start;
        end = _end;
    }

    function attend() external onlyEmployee {
        isAttend[msg.sender] = true;
        attendanceLength += 1;
    }

    function attendancePercentage() external view returns (uint256) {
        uint256 totalEmployee = IEmployee(employee).employeeLength();

        return (attendanceLength * 100) / totalEmployee;
    }
}
