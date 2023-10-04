import { time } from '@nomicfoundation/hardhat-network-helpers';

export async function getEpoch(): Promise<number> {
  return await time.latest();
}
