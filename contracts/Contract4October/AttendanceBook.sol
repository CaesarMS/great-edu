// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import './interface/IEmployee.sol';

contract AttendanceBook {
    uint256 public start; // format epoch, satuan dalam detik
    uint256 public end;
    uint256 public attendanceLength;
    address public employeeContract;

    mapping(address => bool) public isAttend;

    modifier onlyEmployee() {
        require(
            IEmployee(employeeContract).isEmployeeExist(msg.sender),
            'not an employee'
        );
        _;
    }

    constructor(address _employeeContract, uint256 _start, uint256 _end) {
        employeeContract = _employeeContract;
        start = _start;
        end = _end;
    }

    function attend() external onlyEmployee {
        require(
            block.timestamp > start && block.timestamp < end,
            'not in datetime range'
        );
        isAttend[msg.sender] = true;
        attendanceLength += 1;
    }

    function attendancePercentage() external view returns (uint256) {
        uint256 totalEmployee = IEmployee(employeeContract).employeeLength();

        return (attendanceLength * 100) / totalEmployee;
    }
}
