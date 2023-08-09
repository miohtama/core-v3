/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IAddressProviderV3Events,
  IAddressProviderV3EventsInterface,
} from "../../IAddressProviderV3.sol/IAddressProviderV3Events";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "key",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "value",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "version",
        type: "uint256",
      },
    ],
    name: "SetAddress",
    type: "event",
  },
] as const;

export class IAddressProviderV3Events__factory {
  static readonly abi = _abi;
  static createInterface(): IAddressProviderV3EventsInterface {
    return new utils.Interface(_abi) as IAddressProviderV3EventsInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IAddressProviderV3Events {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as IAddressProviderV3Events;
  }
}
