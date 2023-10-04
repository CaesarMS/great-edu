import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { Employee, AttendanceBook } from '../typechain';
import chai from 'chai';
import { ethers, network, deployments } from 'hardhat';
import { getEpoch } from './helper';

const { expect } = chai;

describe('AttendanceBook Contract', () => {
  let employee: Employee;
  let attendanceBook: AttendanceBook;
  let owner: HardhatEthersSigner;
  let employee1: HardhatEthersSigner;
  let notEmployee: HardhatEthersSigner;
  beforeEach(async () => {
    // get signers
    const accounts = await ethers.getSigners();
    owner = accounts[0];
    employee1 = accounts[1];
    notEmployee = accounts[2];

    // deploy with script
    employee = await (await ethers.getContractFactory('Employee'))
      .connect(owner)
      .deploy();

    const start = (await getEpoch()) + 86400;
    const end = (await getEpoch()) + 86400 + 3 * 60 * 60;
    attendanceBook = await (await ethers.getContractFactory('AttendanceBook'))
      .connect(owner)
      .deploy(await employee.getAddress(), start, end);

    // deploy with fixture
    // await deployments.fixture(['EmployeeAttendance']);
    // employee = await ethers.getContract<Employee>('Employee');
    // attendanceBook = await ethers.getContract<AttendanceBook>('AttendanceBook');

    // add employee1
    await employee
      .connect(owner)
      .addEmployee(employee1.address, 'Caesar', 'Programmer');
  });

  describe('Read Function', () => {
    it('attendaceLength() => return 0', async () => {
      const attendanceLength = await attendanceBook.attendanceLength();
      expect(attendanceLength).to.be.equals(0);
    });

    it('isAttend(employee1) => return false', async () => {
      const isEmployee1Attend = await attendanceBook.isAttend(
        employee1.address
      );
      expect(isEmployee1Attend).to.be.false;
    });
  });

  describe('Write Function', () => {
    it('success: attend()', async () => {
      let isEmployee1Attend = await attendanceBook.isAttend(employee1.address);
      expect(isEmployee1Attend).to.be.false;

      const start = Number(await attendanceBook.start());

      // time machine
      await network.provider.send('evm_setNextBlockTimestamp', [start + 10]);
      await network.provider.send('evm_mine');

      await attendanceBook.connect(employee1).attend();

      isEmployee1Attend = await attendanceBook.isAttend(employee1.address);
      expect(isEmployee1Attend).to.be.true;
    });

    it('failed: attend() => after end datetime', async () => {
      let isEmployee1Attend = await attendanceBook.isAttend(employee1.address);
      expect(isEmployee1Attend).to.be.false;

      const end = Number(await attendanceBook.end());

      // time machine
      await network.provider.send('evm_setNextBlockTimestamp', [end + 10]);
      await network.provider.send('evm_mine');

      const attendTx = attendanceBook.connect(employee1).attend();
      await expect(attendTx).to.be.revertedWith('not in datetime range');
    });

    it('failed: attend() => not employee', async () => {
      let isAttend = await attendanceBook.isAttend(notEmployee.address);
      expect(isAttend).to.be.false;

      const start = Number(await attendanceBook.start());

      // time machine
      await network.provider.send('evm_setNextBlockTimestamp', [start + 10]);
      await network.provider.send('evm_mine');

      const attendTx = attendanceBook.connect(notEmployee).attend();
      await expect(attendTx).to.be.revertedWith('not an employee');
    });
  });
});
