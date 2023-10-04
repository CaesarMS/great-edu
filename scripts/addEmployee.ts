import { Employee } from '../typechain';
import { ethers } from 'hardhat';

async function main() {
  // contract instance
  const employee = await ethers.getContract<Employee>('Employee');

  let employeeLength = await employee.employeeLength();
  console.log('employeeLength =', Number(employeeLength));

  // get signers
  const [owner, employee1] = await ethers.getSigners();

  // add employee
  const addEmployee = await employee
    .connect(owner)
    .addEmployee(employee1.address, 'Caesar', 'Programmer');
  await addEmployee.wait();

  employeeLength = await employee.employeeLength();
  console.log('employeeLength =', Number(employeeLength));

  const employeeDetail = await employee.employeeDetail(employee1.address);
  console.log('employeeDetail =', employeeDetail);
}

main().catch((err) => {
  console.log('error =', err);
  process.exitCode = 1;
});
