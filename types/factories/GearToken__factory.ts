/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { GearToken, GearTokenInterface } from "../GearToken";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "delegator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "fromDelegate",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "toDelegate",
        type: "address",
      },
    ],
    name: "DelegateChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "delegate",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "previousBalance",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newBalance",
        type: "uint256",
      },
    ],
    name: "DelegateVotesChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "miner",
        type: "address",
      },
    ],
    name: "MinerSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "TransferAllowed",
    type: "event",
  },
  {
    inputs: [],
    name: "DELEGATION_TYPEHASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DOMAIN_TYPEHASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "allowTransfers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "rawAmount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
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
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    name: "checkpoints",
    outputs: [
      {
        internalType: "uint32",
        name: "fromBlock",
        type: "uint32",
      },
      {
        internalType: "uint96",
        name: "votes",
        type: "uint96",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "delegatee",
        type: "address",
      },
    ],
    name: "delegate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "delegatee",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expiry",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "delegateBySig",
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
    ],
    name: "delegates",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "getCurrentVotes",
    outputs: [
      {
        internalType: "uint96",
        name: "",
        type: "uint96",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
    ],
    name: "getPriorVotes",
    outputs: [
      {
        internalType: "uint96",
        name: "",
        type: "uint96",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "manager",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "miner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
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
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
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
    ],
    name: "numCheckpoints",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "rawAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_miner",
        type: "address",
      },
    ],
    name: "setMiner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "dst",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "rawAmount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "src",
        type: "address",
      },
      {
        internalType: "address",
        name: "dst",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "rawAmount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newManager",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "transfersAllowed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200263d3803806200263d833981016040819052620000349162000122565b6001600160a01b0381166200008f5760405162461bcd60e51b815260206004820152601b60248201527f5a65726f2061646472657373206973206e6f7420616c6c6f7765640000000000604482015260640160405180910390fd5b6001600160a01b03811660008181526001602052604080822080546001600160601b0319166b204fce5e3e2502611000000090811790915590517fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91620000f99190815260200190565b60405180910390a350600680546001600160a81b031916336101000260ff191617905562000154565b6000602082840312156200013557600080fd5b81516001600160a01b03811681146200014d57600080fd5b9392505050565b6124d980620001646000396000f3fe608060405234801561001057600080fd5b50600436106101b95760003560e01c806370a08231116100f9578063b4b5ea5711610097578063dd62ed3e11610071578063dd62ed3e146104c2578063e7a324dc14610507578063f1127ed81461052e578063f2fde38b146105a057600080fd5b8063b4b5ea5714610489578063c3cda5201461049c578063d505accf146104af57600080fd5b806395d89b41116100d357806395d89b411461041a5780639742ca4614610456578063a9059cbb14610469578063b0660c3d1461047c57600080fd5b806370a0823114610393578063782d6fe1146103ca5780637ecebe00146103fa57600080fd5b806330adf81f11610166578063481c6a7511610140578063481c6a7514610304578063587cde1e1461031c5780635c19a95c146103455780636fcfff451461035857600080fd5b806330adf81f14610298578063313ce567146102bf578063349dc329146102d957600080fd5b806320606b701161019757806320606b70146102545780632185810b1461027b57806323b872dd1461028557600080fd5b806306fdde03146101be578063095ea7b31461021057806318160ddd14610233575b600080fd5b6101fa6040518060400160405280600781526020017f47656172626f780000000000000000000000000000000000000000000000000081525081565b6040516102079190611f83565b60405180910390f35b61022361021e36600461200b565b6105b3565b6040519015158152602001610207565b6102466b204fce5e3e2502611000000081565b604051908152602001610207565b6102467f8cad95687ba82c2ce50e74f7b754645e5117c3a5bec8151c0726d5857980a86681565b6102836106b1565b005b610223610293366004612035565b61076b565b6102467f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c981565b6102c7601281565b60405160ff9091168152602001610207565b6007546102ec906001600160a01b031681565b6040516001600160a01b039091168152602001610207565b6006546102ec9061010090046001600160a01b031681565b6102ec61032a366004612071565b6002602052600090815260409020546001600160a01b031681565b610283610353366004612071565b6108d3565b61037e610366366004612071565b60046020526000908152604090205463ffffffff1681565b60405163ffffffff9091168152602001610207565b6102466103a1366004612071565b6001600160a01b03166000908152600160205260409020546bffffffffffffffffffffffff1690565b6103dd6103d836600461200b565b6108e0565b6040516bffffffffffffffffffffffff9091168152602001610207565b610246610408366004612071565b60056020526000908152604090205481565b6101fa6040518060400160405280600481526020017f474541520000000000000000000000000000000000000000000000000000000081525081565b610283610464366004612071565b610b92565b61022361047736600461200b565b610ca9565b6006546102239060ff1681565b6103dd610497366004612071565b610ce5565b6102836104aa36600461209d565b610d69565b6102836104bd3660046120f5565b61110a565b6102466104d036600461215f565b6001600160a01b039182166000908152602081815260408083209390941682529190915220546bffffffffffffffffffffffff1690565b6102467fe48329057bfd03d55e49b547132e39cffd9c1820ad7b9d4c5307691425d15adf81565b61057761053c366004612192565b600360209081526000928352604080842090915290825290205463ffffffff81169064010000000090046bffffffffffffffffffffffff1682565b6040805163ffffffff90931683526bffffffffffffffffffffffff909116602083015201610207565b6102836105ae366004612071565b611596565b6000807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff83036105f057506bffffffffffffffffffffffff610615565b6106128360405180606001604052806025815260200161230f602591396116c9565b90505b336000818152602081815260408083206001600160a01b0389168085529083529281902080547fffffffffffffffffffffffffffffffffffffffff000000000000000000000000166bffffffffffffffffffffffff871690811790915590519081529192917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a360019150505b92915050565b60065461010090046001600160a01b031633146107155760405162461bcd60e51b815260206004820152601f60248201527f476561723a3a63616c6c6572206973206e6f7420746865206d616e616765720060448201526064015b60405180910390fd5b600680547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001660011790556040517f795b0e16c8da9807b0a215f3749bd6dbcc49fc0472183f4e446abb7dcbd9d00790600090a1565b6001600160a01b0383166000908152602081815260408083203380855290835281842054825160608101909352602580845291936bffffffffffffffffffffffff9091169285926107c6928892919061230f908301396116c9565b9050866001600160a01b0316836001600160a01b0316141580156107f857506bffffffffffffffffffffffff82811614155b156108bb57600061082283836040518060600160405280603d8152602001612431603d9139611701565b6001600160a01b03898116600081815260208181526040808320948a168084529482529182902080547fffffffffffffffffffffffffffffffffffffffff000000000000000000000000166bffffffffffffffffffffffff87169081179091559151918252939450919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505b6108c6878783611755565b5060019695505050505050565b6108dd3382611a66565b50565b60004382106109575760405162461bcd60e51b815260206004820152602760248201527f476561723a3a6765745072696f72566f7465733a206e6f74207965742064657460448201527f65726d696e656400000000000000000000000000000000000000000000000000606482015260840161070c565b6001600160a01b03831660009081526004602052604081205463ffffffff16908190036109885760009150506106ab565b6001600160a01b038416600090815260036020526040812084916109ad600185612201565b63ffffffff90811682526020820192909252604001600020541611610a26576001600160a01b0384166000908152600360205260408120906109f0600184612201565b63ffffffff16815260208101919091526040016000205464010000000090046bffffffffffffffffffffffff1691506106ab9050565b6001600160a01b038416600090815260036020908152604080832083805290915290205463ffffffff16831015610a615760009150506106ab565b600080610a6f600184612201565b90505b8163ffffffff168163ffffffff161115610b475760006002610a948484612201565b610a9e9190612225565b610aa89083612201565b6001600160a01b038816600090815260036020908152604080832063ffffffff8581168552908352928190208151808301909252549283168082526401000000009093046bffffffffffffffffffffffff1691810191909152919250879003610b1b576020015194506106ab9350505050565b805163ffffffff16871115610b3257819350610b40565b610b3d600183612201565b92505b5050610a72565b506001600160a01b038516600090815260036020908152604080832063ffffffff909416835292905220546bffffffffffffffffffffffff6401000000009091041691505092915050565b60065461010090046001600160a01b03163314610bf15760405162461bcd60e51b815260206004820152601f60248201527f476561723a3a63616c6c6572206973206e6f7420746865206d616e6167657200604482015260640161070c565b6001600160a01b038116610c475760405162461bcd60e51b815260206004820152601b60248201527f5a65726f2061646472657373206973206e6f7420616c6c6f7765640000000000604482015260640161070c565b600780547fffffffffffffffffffffffff0000000000000000000000000000000000000000166001600160a01b0383169081179091556040517f2f834d1c8c4b956018fff5faca4d99868ae635487424d9c265c257ccbc698c6a90600090a250565b600080610cce83604051806060016040528060268152602001612364602691396116c9565b9050610cdb338583611755565b5060019392505050565b6001600160a01b03811660009081526004602052604081205463ffffffff1680610d10576000610d62565b6001600160a01b038316600090815260036020526040812090610d34600184612201565b63ffffffff16815260208101919091526040016000205464010000000090046bffffffffffffffffffffffff165b9392505050565b604080518082018252600781527f47656172626f780000000000000000000000000000000000000000000000000060209182015281517f8cad95687ba82c2ce50e74f7b754645e5117c3a5bec8151c0726d5857980a866818301527f028ef9f797075f74ac647c65fde04fb0f128c2d59fd40f45732269917642fd4681840152466060820152306080808301919091528351808303909101815260a0820184528051908301207fe48329057bfd03d55e49b547132e39cffd9c1820ad7b9d4c5307691425d15adf60c08301526001600160a01b038a1660e08301526101008201899052610120808301899052845180840390910181526101408301909452835193909201929092207f19010000000000000000000000000000000000000000000000000000000000006101608401526101628301829052610182830181905290916000906101a201604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181528282528051602091820120600080855291840180845281905260ff8a169284019290925260608301889052608083018790529092509060019060a0016020604051602081039080840390855afa158015610f3a573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe001519150506001600160a01b038116610fe15760405162461bcd60e51b815260206004820152602660248201527f476561723a3a64656c656761746542795369673a20696e76616c69642073696760448201527f6e61747572650000000000000000000000000000000000000000000000000000606482015260840161070c565b6001600160a01b03811660009081526005602052604081208054916110058361226f565b91905055891461107d5760405162461bcd60e51b815260206004820152602260248201527f476561723a3a64656c656761746542795369673a20696e76616c6964206e6f6e60448201527f6365000000000000000000000000000000000000000000000000000000000000606482015260840161070c565b874211156110f35760405162461bcd60e51b815260206004820152602660248201527f476561723a3a64656c656761746542795369673a207369676e6174757265206560448201527f7870697265640000000000000000000000000000000000000000000000000000606482015260840161070c565b6110fd818b611a66565b505050505b505050505050565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff860361114657506bffffffffffffffffffffffff61116b565b611168866040518060600160405280602481526020016123d9602491396116c9565b90505b604080518082018252600781527f47656172626f780000000000000000000000000000000000000000000000000060209182015281517f8cad95687ba82c2ce50e74f7b754645e5117c3a5bec8151c0726d5857980a866818301527f028ef9f797075f74ac647c65fde04fb0f128c2d59fd40f45732269917642fd4681840152466060820152306080808301919091528351808303909101815260a090910183528051908201206001600160a01b038b166000908152600590925291812080547f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9918c918c918c91908661125e8361226f565b909155506040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810188905260e001604051602081830303815290604052805190602001209050600082826040516020016112f89291907f190100000000000000000000000000000000000000000000000000000000000081526002810192909252602282015260420190565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181528282528051602091820120600080855291840180845281905260ff8b169284019290925260608301899052608083018890529092509060019060a0016020604051602081039080840390855afa158015611381573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe001519150506001600160a01b0381166114025760405162461bcd60e51b815260206004820152601f60248201527f476561723a3a7065726d69743a20696e76616c6964207369676e617475726500604482015260640161070c565b8b6001600160a01b0316816001600160a01b0316146114635760405162461bcd60e51b815260206004820152601a60248201527f476561723a3a7065726d69743a20756e617574686f72697a6564000000000000604482015260640161070c565b884211156114b35760405162461bcd60e51b815260206004820152601f60248201527f476561723a3a7065726d69743a207369676e6174757265206578706972656400604482015260640161070c565b846000808e6001600160a01b03166001600160a01b0316815260200190815260200160002060008d6001600160a01b03166001600160a01b0316815260200190815260200160002060006101000a8154816bffffffffffffffffffffffff02191690836bffffffffffffffffffffffff1602179055508a6001600160a01b03168c6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258760405161158091906bffffffffffffffffffffffff91909116815260200190565b60405180910390a3505050505050505050505050565b60065461010090046001600160a01b031633146115f55760405162461bcd60e51b815260206004820152601f60248201527f476561723a3a63616c6c6572206973206e6f7420746865206d616e6167657200604482015260640161070c565b6001600160a01b03811661164b5760405162461bcd60e51b815260206004820152601b60248201527f5a65726f2061646472657373206973206e6f7420616c6c6f7765640000000000604482015260640161070c565b6006546040516001600160a01b0380841692610100900416907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3600680546001600160a01b03909216610100027fffffffffffffffffffffff0000000000000000000000000000000000000000ff909216919091179055565b6000816c0100000000000000000000000084106116f95760405162461bcd60e51b815260040161070c9190611f83565b509192915050565b6000836bffffffffffffffffffffffff16836bffffffffffffffffffffffff16111582906117425760405162461bcd60e51b815260040161070c9190611f83565b5061174d83856122a7565b949350505050565b60065460ff1680611775575060065461010090046001600160a01b031633145b8061178a57506007546001600160a01b031633145b6117d65760405162461bcd60e51b815260206004820152601d60248201527f476561723a3a7472616e73666572732061726520666f7262696464656e000000604482015260640161070c565b6001600160a01b0383166118525760405162461bcd60e51b815260206004820152603c60248201527f476561723a3a5f7472616e73666572546f6b656e733a2063616e6e6f7420747260448201527f616e736665722066726f6d20746865207a65726f206164647265737300000000606482015260840161070c565b6001600160a01b0382166118ce5760405162461bcd60e51b815260206004820152603a60248201527f476561723a3a5f7472616e73666572546f6b656e733a2063616e6e6f7420747260448201527f616e7366657220746f20746865207a65726f2061646472657373000000000000606482015260840161070c565b6001600160a01b03831660009081526001602090815260409182902054825160608101909352603680845261191e936bffffffffffffffffffffffff909216928592919061246e90830139611701565b6001600160a01b03848116600090815260016020908152604080832080547fffffffffffffffffffffffffffffffffffffffff000000000000000000000000166bffffffffffffffffffffffff9687161790559286168252908290205482516060810190935260308084526119a3949190911692859290919061233490830139611b0d565b6001600160a01b0383811660008181526001602090815260409182902080547fffffffffffffffffffffffffffffffffffffffff000000000000000000000000166bffffffffffffffffffffffff968716179055905193851684529092918616917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a36001600160a01b03808416600090815260026020526040808220548584168352912054611a6192918216911683611b64565b505050565b6001600160a01b03808316600081815260026020818152604080842080546001845282862054949093528787167fffffffffffffffffffffffff000000000000000000000000000000000000000084168117909155905191909516946bffffffffffffffffffffffff9092169391928592917f3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f9190a4611b07828483611b64565b50505050565b600080611b1a84866122cc565b9050846bffffffffffffffffffffffff16816bffffffffffffffffffffffff1610158390611b5b5760405162461bcd60e51b815260040161070c9190611f83565b50949350505050565b816001600160a01b0316836001600160a01b031614158015611b9457506000816bffffffffffffffffffffffff16115b15611a61576001600160a01b03831615611c5f576001600160a01b03831660009081526004602052604081205463ffffffff169081611bd4576000611c26565b6001600160a01b038516600090815260036020526040812090611bf8600185612201565b63ffffffff16815260208101919091526040016000205464010000000090046bffffffffffffffffffffffff165b90506000611c4d828560405180606001604052806028815260200161238a60289139611701565b9050611c5b86848484611d1d565b5050505b6001600160a01b03821615611a61576001600160a01b03821660009081526004602052604081205463ffffffff169081611c9a576000611cec565b6001600160a01b038416600090815260036020526040812090611cbe600185612201565b63ffffffff16815260208101919091526040016000205464010000000090046bffffffffffffffffffffffff165b90506000611d1382856040518060600160405280602781526020016123b260279139611b0d565b9050611102858484845b6000611d41436040518060600160405280603481526020016123fd60349139611f5f565b905060008463ffffffff16118015611d9b57506001600160a01b038516600090815260036020526040812063ffffffff831691611d7f600188612201565b63ffffffff908116825260208201929092526040016000205416145b15611e24576001600160a01b03851660009081526003602052604081208391611dc5600188612201565b63ffffffff168152602081019190915260400160002080546bffffffffffffffffffffffff92909216640100000000027fffffffffffffffffffffffffffffffff000000000000000000000000ffffffff909216919091179055611f05565b60408051808201825263ffffffff80841682526bffffffffffffffffffffffff80861660208085019182526001600160a01b038b166000908152600382528681208b8616825290915294909420925183549451909116640100000000027fffffffffffffffffffffffffffffffff00000000000000000000000000000000909416911617919091179055611eb98460016122f1565b6001600160a01b038616600090815260046020526040902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000001663ffffffff929092169190911790555b604080516bffffffffffffffffffffffff8086168252841660208201526001600160a01b038716917fdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724910160405180910390a25050505050565b60008164010000000084106116f95760405162461bcd60e51b815260040161070c91905b600060208083528351808285015260005b81811015611fb057858101830151858201604001528201611f94565b5060006040828601015260407fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8301168501019250505092915050565b80356001600160a01b038116811461200657600080fd5b919050565b6000806040838503121561201e57600080fd5b61202783611fef565b946020939093013593505050565b60008060006060848603121561204a57600080fd5b61205384611fef565b925061206160208501611fef565b9150604084013590509250925092565b60006020828403121561208357600080fd5b610d6282611fef565b803560ff8116811461200657600080fd5b60008060008060008060c087890312156120b657600080fd5b6120bf87611fef565b955060208701359450604087013593506120db6060880161208c565b92506080870135915060a087013590509295509295509295565b600080600080600080600060e0888a03121561211057600080fd5b61211988611fef565b965061212760208901611fef565b955060408801359450606088013593506121436080890161208c565b925060a0880135915060c0880135905092959891949750929550565b6000806040838503121561217257600080fd5b61217b83611fef565b915061218960208401611fef565b90509250929050565b600080604083850312156121a557600080fd5b6121ae83611fef565b9150602083013563ffffffff811681146121c757600080fd5b809150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b63ffffffff82811682821603908082111561221e5761221e6121d2565b5092915050565b600063ffffffff80841680612263577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b92169190910492915050565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82036122a0576122a06121d2565b5060010190565b6bffffffffffffffffffffffff82811682821603908082111561221e5761221e6121d2565b6bffffffffffffffffffffffff81811683821601908082111561221e5761221e6121d2565b63ffffffff81811683821601908082111561221e5761221e6121d256fe476561723a3a617070726f76653a20616d6f756e7420657863656564732039362062697473476561723a3a5f7472616e73666572546f6b656e733a207472616e7366657220616d6f756e74206f766572666c6f7773476561723a3a7472616e736665723a20616d6f756e7420657863656564732039362062697473476561723a3a5f6d6f7665566f7465733a20766f746520616d6f756e7420756e646572666c6f7773476561723a3a5f6d6f7665566f7465733a20766f746520616d6f756e74206f766572666c6f7773476561723a3a7065726d69743a20616d6f756e7420657863656564732039362062697473476561723a3a5f7772697465436865636b706f696e743a20626c6f636b206e756d62657220657863656564732033322062697473476561723a3a7472616e7366657246726f6d3a207472616e7366657220616d6f756e742065786365656473207370656e64657220616c6c6f77616e6365476561723a3a5f7472616e73666572546f6b656e733a207472616e7366657220616d6f756e7420657863656564732062616c616e6365a26469706673582212206890a8bf82fce9be8dbffee08a43c7ea849635de10af18c33de5c92f1767af9164736f6c63430008110033";

type GearTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: GearTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class GearToken__factory extends ContractFactory {
  constructor(...args: GearTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "GearToken";
  }

  override deploy(
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<GearToken> {
    return super.deploy(account, overrides || {}) as Promise<GearToken>;
  }
  override getDeployTransaction(
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(account, overrides || {});
  }
  override attach(address: string): GearToken {
    return super.attach(address) as GearToken;
  }
  override connect(signer: Signer): GearToken__factory {
    return super.connect(signer) as GearToken__factory;
  }
  static readonly contractName: "GearToken";

  public readonly contractName: "GearToken";

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GearTokenInterface {
    return new utils.Interface(_abi) as GearTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): GearToken {
    return new Contract(address, _abi, signerOrProvider) as GearToken;
  }
}
