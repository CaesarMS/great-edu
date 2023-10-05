import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import AttendanceBook from './abis/AttendanceBook.json';
import Employee from './abis/Employee.json';
import { ethers } from 'ethers';

function App() {
  const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

  const [connected, setConnected] = useState(undefined);
  const [signer, setSigner] = useState(undefined);
  const [employeeInstance, setEmployeeInstance] = useState(undefined);
  const [attendanceBookInstance, setAttendanceBookInstance] =
    useState(undefined);
  const [selectedAddress, setSelectedAddress] = useState(undefined);
  const [isAttend, setIsAttend] = useState(undefined);
  const [isEmployee, setIsEmployee] = useState(undefined);
  const [txBeingSent, setTxBeingSent] = useState(undefined);
  const [transactionError, setTransactionError] = useState(undefined);
  const [networkError, setNetworkError] = useState(undefined);
  const [employeeAddressToAdd, setEmployeeAddressToAdd] = useState('');
  const [employeeNameToAdd, setEmployeeNameToAdd] = useState('');
  const [employeePositionToAdd, setEmployeePositionToAdd] = useState('');

  const connectWallet = async () => {
    setNetworkError(undefined);
    setTransactionError(undefined);
    const [selectedAddress] = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    setSelectedAddress(selectedAddress);
    console.log('selectedAddress =', selectedAddress);
    setConnected(true);

    const provider = new ethers.BrowserProvider(window.ethereum);
    setSigner(await provider.getSigner(0));

    const employee = new ethers.Contract(
      Employee.address,
      Employee.abi,
      provider
    );
    setEmployeeInstance(employee);

    const attendanceBook = new ethers.Contract(
      AttendanceBook.address,
      AttendanceBook.abi,
      provider
    );
    setAttendanceBookInstance(attendanceBook);
  };

  const attendStatus = async () => {
    const status = await attendanceBookInstance.isAttend(selectedAddress);
    setIsAttend(status);
  };

  const employeeStatus = async () => {
    const status = await employeeInstance.isEmployeeExist(selectedAddress);
    setIsEmployee(status);
  };

  const addEmployee = async () => {
    try {
      setNetworkError(undefined);
      setTransactionError(undefined);

      const tx = await employeeInstance
        .connect(signer)
        .addEmployee(
          employeeAddressToAdd,
          employeeNameToAdd,
          employeePositionToAdd
        );
      setTxBeingSent(tx.hash);

      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error('Transaction failed');
      }
    } catch (err) {
      if (err.code !== ERROR_CODE_TX_REJECTED_BY_USER) {
        console.error(err);
        setTransactionError(err);
      }
    } finally {
      setTxBeingSent(undefined);
    }
  };

  const attend = async () => {
    try {
      setNetworkError(undefined);
      setTransactionError(undefined);

      const tx = await attendanceBookInstance.connect(signer).attend();
      setTxBeingSent(tx.hash);

      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error('Transaction failed');
      }
    } catch (err) {
      if (err.code !== ERROR_CODE_TX_REJECTED_BY_USER) {
        console.error(err);
        setTransactionError(err);
      }
    } finally {
      setTxBeingSent(undefined);
    }
  };

  useEffect(() => {
    (async () => {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      if (accounts.length > 0) {
        connectWallet();
      }
    })();
  }, []);

  useEffect(() => {
    if (employeeInstance) {
      employeeStatus();
    }
  }, [employeeInstance]);

  useEffect(() => {
    if (attendanceBookInstance) {
      attendStatus();
    }
  }, [attendanceBookInstance]);

  window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts[0] && accounts[0] !== selectedAddress) {
      connectWallet();
    }
  });

  if (window.ethereum === undefined) {
    return <div>No wallet detected</div>;
  }

  return (
    <main className="main-container">
      <h1>Employee - Attendance</h1>
      <button onClick={() => connectWallet()} disabled={connected}>
        Connect Wallet 🚀
      </button>
      <section>
        <h3>Account Info</h3>
        <p className="address">
          <span>Account Address:</span> <code>{selectedAddress}</code>
        </p>
      </section>
      <hr />
      <section>
        <h3>New Employee</h3>
        <div>
          <input
            type="text"
            value={employeeAddressToAdd}
            onChange={(e) => setEmployeeAddressToAdd(e.target.value)}
            placeholder="employee address"
          />{' '}
          <br />
          <input
            type="text"
            value={employeeNameToAdd}
            onChange={(e) => setEmployeeNameToAdd(e.target.value)}
            placeholder="employee name"
          />
          <br />
          <input
            type="text"
            value={employeePositionToAdd}
            onChange={(e) => setEmployeePositionToAdd(e.target.value)}
            placeholder="employee position"
          />
          <br />
          <button
            onClick={() => addEmployee()}
            disabled={
              !(
                employeeAddressToAdd &&
                employeeNameToAdd &&
                employeePositionToAdd
              )
            }
          >
            Add Employee
          </button>
        </div>
      </section>
      <hr />
      <section>
        <h3>Attendance Book</h3>
        <p className="address">
          <span>Is attend:</span> <code>{String(isAttend)}</code>
        </p>
        <div>
          <button onClick={() => attend()} disabled={isAttend || !isEmployee}>
            Attend!
          </button>
        </div>
      </section>
      {(txBeingSent || networkError || transactionError) && (
        <section className="transaction-status">
          <p>{txBeingSent}</p>
          <p>{networkError?.toString()}</p>
          <p>{transactionError?.toString()}</p>
        </section>
      )}
    </main>
  );
}

export default App;

// ref
// https://betterprogramming.pub/build-a-coffee-vending-dapp-with-solidity-hardhat-and-react-b9336d34f7f6
