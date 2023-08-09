/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { BotListMock, BotListMockInterface } from "../BotListMock";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "eraseAllBotPermissions",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "getBotStatus",
    outputs: [
      {
        internalType: "uint256",
        name: "botPermissions",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "forbidden",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "hasSpecialPermissions",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "payer",
        type: "address",
      },
      {
        internalType: "address",
        name: "creditManager",
        type: "address",
      },
      {
        internalType: "address",
        name: "creditAccount",
        type: "address",
      },
      {
        internalType: "address",
        name: "bot",
        type: "address",
      },
      {
        internalType: "uint72",
        name: "paymentAmount",
        type: "uint72",
      },
    ],
    name: "payBot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint192",
        name: "",
        type: "uint192",
      },
      {
        internalType: "uint72",
        name: "",
        type: "uint72",
      },
      {
        internalType: "uint72",
        name: "",
        type: "uint72",
      },
    ],
    name: "setBotPermissions",
    outputs: [
      {
        internalType: "uint256",
        name: "activeBotsRemaining",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "activeBotsRemaining",
        type: "uint256",
      },
    ],
    name: "setBotPermissionsReturn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "botPermissions",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "forbidden",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "hasSpecialPermissions",
        type: "bool",
      },
    ],
    name: "setBotStatusReturns",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_value",
        type: "bool",
      },
    ],
    name: "setRevertOnErase",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506104e7806100206000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c80635ea381dc1161005b5780635ea381dc146100eb57806368f8085c1461015f5780637bdfc874146101ac578063ca7eee8b146101bf57600080fd5b80631bfc031c14610082578063407552e814610097578063474581f0146100ac575b600080fd5b610095610090366004610283565b600355565b005b6100956100a53660046102de565b5050505050565b6100956100ba366004610353565b600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016911515919091179055565b6100956100f9366004610375565b60019290925560028054921515610100027fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff921515929092167fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000090931692909217179055565b61018a61016d3660046103b1565b5050600154600254909260ff808316935061010090920490911690565b6040805193845291151560208401521515908201526060015b60405180910390f35b6100956101ba3660046103eb565b6101e8565b6101da6101cd36600461041e565b5050600354949350505050565b6040519081526020016101a3565b60005460ff161561027f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f556e65787065637465642063616c6c20746f206572617365416c6c426f74506560448201527f726d697373696f6e730000000000000000000000000000000000000000000000606482015260840160405180910390fd5b5050565b60006020828403121561029557600080fd5b5035919050565b803573ffffffffffffffffffffffffffffffffffffffff811681146102c057600080fd5b919050565b803568ffffffffffffffffff811681146102c057600080fd5b600080600080600060a086880312156102f657600080fd5b6102ff8661029c565b945061030d6020870161029c565b935061031b6040870161029c565b92506103296060870161029c565b9150610337608087016102c5565b90509295509295909350565b803580151581146102c057600080fd5b60006020828403121561036557600080fd5b61036e82610343565b9392505050565b60008060006060848603121561038a57600080fd5b8335925061039a60208501610343565b91506103a860408501610343565b90509250925092565b6000806000606084860312156103c657600080fd5b6103cf8461029c565b92506103dd6020850161029c565b91506103a86040850161029c565b600080604083850312156103fe57600080fd5b6104078361029c565b91506104156020840161029c565b90509250929050565b60008060008060008060c0878903121561043757600080fd5b6104408761029c565b955061044e6020880161029c565b945061045c6040880161029c565b9350606087013577ffffffffffffffffffffffffffffffffffffffffffffffff8116811461048957600080fd5b9250610497608088016102c5565b91506104a560a088016102c5565b9050929550929550929556fea2646970667358221220a0ca661acdc36bb611c9b96f8591e1330e07fb9954082c5fd5c2e9a82315774864736f6c63430008110033";

type BotListMockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: BotListMockConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class BotListMock__factory extends ContractFactory {
  constructor(...args: BotListMockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "BotListMock";
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<BotListMock> {
    return super.deploy(overrides || {}) as Promise<BotListMock>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): BotListMock {
    return super.attach(address) as BotListMock;
  }
  override connect(signer: Signer): BotListMock__factory {
    return super.connect(signer) as BotListMock__factory;
  }
  static readonly contractName: "BotListMock";

  public readonly contractName: "BotListMock";

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BotListMockInterface {
    return new utils.Interface(_abi) as BotListMockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BotListMock {
    return new Contract(address, _abi, signerOrProvider) as BotListMock;
  }
}
