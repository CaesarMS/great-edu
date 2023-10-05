import { DeployFunction } from 'hardhat-deploy/dist/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async ({
  deployments,
  ethers,
}: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments;
  const accounts = await ethers.getSigners();

  const deployer = accounts[0];
  console.log('deployer address =', deployer.address);

  // deploy Employee
  const employee = await deploy('Employee', {
    contract: 'Employee',
    from: deployer.address,
    args: [],
    gasLimit: 1000000,
  });
  console.log('employee deployed at ', employee.address);

  // deploy Attendance Book
  const start = 1696464900;
  const end = 1696551300;

  const attendaceBook = await deploy('AttendanceBook', {
    contract: 'AttendanceBook',
    from: deployer.address,
    args: [employee.address, start, end],
    gasLimit: 1000000,
  });
  console.log('attendaceBook deployed at ', attendaceBook.address);
};

func.tags = ['EmployeeAttendance'];

export default func;
