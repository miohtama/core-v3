/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export interface IGaugeV3Interface extends utils.Interface {
  functions: {
    "addQuotaToken(address,uint16,uint16)": FunctionFragment;
    "changeQuotaTokenRateParams(address,uint16,uint16)": FunctionFragment;
    "epochFrozen()": FunctionFragment;
    "epochLastUpdate()": FunctionFragment;
    "getRates(address[])": FunctionFragment;
    "isTokenAdded(address)": FunctionFragment;
    "pool()": FunctionFragment;
    "quotaRateParams(address)": FunctionFragment;
    "setFrozenEpoch(bool)": FunctionFragment;
    "unvote(address,uint96,bytes)": FunctionFragment;
    "updateEpoch()": FunctionFragment;
    "userTokenVotes(address,address)": FunctionFragment;
    "version()": FunctionFragment;
    "vote(address,uint96,bytes)": FunctionFragment;
    "voter()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addQuotaToken"
      | "changeQuotaTokenRateParams"
      | "epochFrozen"
      | "epochLastUpdate"
      | "getRates"
      | "isTokenAdded"
      | "pool"
      | "quotaRateParams"
      | "setFrozenEpoch"
      | "unvote"
      | "updateEpoch"
      | "userTokenVotes"
      | "version"
      | "vote"
      | "voter"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addQuotaToken",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "changeQuotaTokenRateParams",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "epochFrozen",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "epochLastUpdate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getRates",
    values: [PromiseOrValue<string>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "isTokenAdded",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "pool", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "quotaRateParams",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setFrozenEpoch",
    values: [PromiseOrValue<boolean>]
  ): string;
  encodeFunctionData(
    functionFragment: "unvote",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "updateEpoch",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "userTokenVotes",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "version", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "vote",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(functionFragment: "voter", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "addQuotaToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "changeQuotaTokenRateParams",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "epochFrozen",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "epochLastUpdate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getRates", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isTokenAdded",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "pool", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "quotaRateParams",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setFrozenEpoch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unvote", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "updateEpoch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "userTokenVotes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "version", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "vote", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "voter", data: BytesLike): Result;

  events: {
    "AddQuotaToken(address,uint16,uint16)": EventFragment;
    "SetFrozenEpoch(bool)": EventFragment;
    "SetQuotaTokenParams(address,uint16,uint16)": EventFragment;
    "Unvote(address,address,uint96,bool)": EventFragment;
    "UpdateEpoch(uint16)": EventFragment;
    "Vote(address,address,uint96,bool)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AddQuotaToken"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetFrozenEpoch"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetQuotaTokenParams"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Unvote"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UpdateEpoch"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Vote"): EventFragment;
}

export interface AddQuotaTokenEventObject {
  token: string;
  minRate: number;
  maxRate: number;
}
export type AddQuotaTokenEvent = TypedEvent<
  [string, number, number],
  AddQuotaTokenEventObject
>;

export type AddQuotaTokenEventFilter = TypedEventFilter<AddQuotaTokenEvent>;

export interface SetFrozenEpochEventObject {
  status: boolean;
}
export type SetFrozenEpochEvent = TypedEvent<
  [boolean],
  SetFrozenEpochEventObject
>;

export type SetFrozenEpochEventFilter = TypedEventFilter<SetFrozenEpochEvent>;

export interface SetQuotaTokenParamsEventObject {
  token: string;
  minRate: number;
  maxRate: number;
}
export type SetQuotaTokenParamsEvent = TypedEvent<
  [string, number, number],
  SetQuotaTokenParamsEventObject
>;

export type SetQuotaTokenParamsEventFilter =
  TypedEventFilter<SetQuotaTokenParamsEvent>;

export interface UnvoteEventObject {
  user: string;
  token: string;
  votes: BigNumber;
  lpSide: boolean;
}
export type UnvoteEvent = TypedEvent<
  [string, string, BigNumber, boolean],
  UnvoteEventObject
>;

export type UnvoteEventFilter = TypedEventFilter<UnvoteEvent>;

export interface UpdateEpochEventObject {
  epochNow: number;
}
export type UpdateEpochEvent = TypedEvent<[number], UpdateEpochEventObject>;

export type UpdateEpochEventFilter = TypedEventFilter<UpdateEpochEvent>;

export interface VoteEventObject {
  user: string;
  token: string;
  votes: BigNumber;
  lpSide: boolean;
}
export type VoteEvent = TypedEvent<
  [string, string, BigNumber, boolean],
  VoteEventObject
>;

export type VoteEventFilter = TypedEventFilter<VoteEvent>;

export interface IGaugeV3 extends BaseContract {
  contractName: "IGaugeV3";

  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IGaugeV3Interface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    addQuotaToken(
      token: PromiseOrValue<string>,
      minRate: PromiseOrValue<BigNumberish>,
      maxRate: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    changeQuotaTokenRateParams(
      token: PromiseOrValue<string>,
      minRate: PromiseOrValue<BigNumberish>,
      maxRate: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    epochFrozen(overrides?: CallOverrides): Promise<[boolean]>;

    epochLastUpdate(overrides?: CallOverrides): Promise<[number]>;

    getRates(
      tokens: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<[number[]] & { rates: number[] }>;

    isTokenAdded(
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    pool(overrides?: CallOverrides): Promise<[string]>;

    quotaRateParams(
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [number, number, BigNumber, BigNumber] & {
        minRate: number;
        maxRate: number;
        totalVotesLpSide: BigNumber;
        totalVotesCaSide: BigNumber;
      }
    >;

    setFrozenEpoch(
      status: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    unvote(
      user: PromiseOrValue<string>,
      votes: PromiseOrValue<BigNumberish>,
      extraData: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateEpoch(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    userTokenVotes(
      user: PromiseOrValue<string>,
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        votesLpSide: BigNumber;
        votesCaSide: BigNumber;
      }
    >;

    version(overrides?: CallOverrides): Promise<[BigNumber]>;

    vote(
      user: PromiseOrValue<string>,
      votes: PromiseOrValue<BigNumberish>,
      extraData: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    voter(overrides?: CallOverrides): Promise<[string]>;
  };

  addQuotaToken(
    token: PromiseOrValue<string>,
    minRate: PromiseOrValue<BigNumberish>,
    maxRate: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  changeQuotaTokenRateParams(
    token: PromiseOrValue<string>,
    minRate: PromiseOrValue<BigNumberish>,
    maxRate: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  epochFrozen(overrides?: CallOverrides): Promise<boolean>;

  epochLastUpdate(overrides?: CallOverrides): Promise<number>;

  getRates(
    tokens: PromiseOrValue<string>[],
    overrides?: CallOverrides
  ): Promise<number[]>;

  isTokenAdded(
    token: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  pool(overrides?: CallOverrides): Promise<string>;

  quotaRateParams(
    token: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<
    [number, number, BigNumber, BigNumber] & {
      minRate: number;
      maxRate: number;
      totalVotesLpSide: BigNumber;
      totalVotesCaSide: BigNumber;
    }
  >;

  setFrozenEpoch(
    status: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  unvote(
    user: PromiseOrValue<string>,
    votes: PromiseOrValue<BigNumberish>,
    extraData: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateEpoch(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  userTokenVotes(
    user: PromiseOrValue<string>,
    token: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { votesLpSide: BigNumber; votesCaSide: BigNumber }
  >;

  version(overrides?: CallOverrides): Promise<BigNumber>;

  vote(
    user: PromiseOrValue<string>,
    votes: PromiseOrValue<BigNumberish>,
    extraData: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  voter(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    addQuotaToken(
      token: PromiseOrValue<string>,
      minRate: PromiseOrValue<BigNumberish>,
      maxRate: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    changeQuotaTokenRateParams(
      token: PromiseOrValue<string>,
      minRate: PromiseOrValue<BigNumberish>,
      maxRate: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    epochFrozen(overrides?: CallOverrides): Promise<boolean>;

    epochLastUpdate(overrides?: CallOverrides): Promise<number>;

    getRates(
      tokens: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<number[]>;

    isTokenAdded(
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    pool(overrides?: CallOverrides): Promise<string>;

    quotaRateParams(
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [number, number, BigNumber, BigNumber] & {
        minRate: number;
        maxRate: number;
        totalVotesLpSide: BigNumber;
        totalVotesCaSide: BigNumber;
      }
    >;

    setFrozenEpoch(
      status: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    unvote(
      user: PromiseOrValue<string>,
      votes: PromiseOrValue<BigNumberish>,
      extraData: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateEpoch(overrides?: CallOverrides): Promise<void>;

    userTokenVotes(
      user: PromiseOrValue<string>,
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        votesLpSide: BigNumber;
        votesCaSide: BigNumber;
      }
    >;

    version(overrides?: CallOverrides): Promise<BigNumber>;

    vote(
      user: PromiseOrValue<string>,
      votes: PromiseOrValue<BigNumberish>,
      extraData: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    voter(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "AddQuotaToken(address,uint16,uint16)"(
      token?: PromiseOrValue<string> | null,
      minRate?: null,
      maxRate?: null
    ): AddQuotaTokenEventFilter;
    AddQuotaToken(
      token?: PromiseOrValue<string> | null,
      minRate?: null,
      maxRate?: null
    ): AddQuotaTokenEventFilter;

    "SetFrozenEpoch(bool)"(status?: null): SetFrozenEpochEventFilter;
    SetFrozenEpoch(status?: null): SetFrozenEpochEventFilter;

    "SetQuotaTokenParams(address,uint16,uint16)"(
      token?: PromiseOrValue<string> | null,
      minRate?: null,
      maxRate?: null
    ): SetQuotaTokenParamsEventFilter;
    SetQuotaTokenParams(
      token?: PromiseOrValue<string> | null,
      minRate?: null,
      maxRate?: null
    ): SetQuotaTokenParamsEventFilter;

    "Unvote(address,address,uint96,bool)"(
      user?: PromiseOrValue<string> | null,
      token?: PromiseOrValue<string> | null,
      votes?: null,
      lpSide?: null
    ): UnvoteEventFilter;
    Unvote(
      user?: PromiseOrValue<string> | null,
      token?: PromiseOrValue<string> | null,
      votes?: null,
      lpSide?: null
    ): UnvoteEventFilter;

    "UpdateEpoch(uint16)"(epochNow?: null): UpdateEpochEventFilter;
    UpdateEpoch(epochNow?: null): UpdateEpochEventFilter;

    "Vote(address,address,uint96,bool)"(
      user?: PromiseOrValue<string> | null,
      token?: PromiseOrValue<string> | null,
      votes?: null,
      lpSide?: null
    ): VoteEventFilter;
    Vote(
      user?: PromiseOrValue<string> | null,
      token?: PromiseOrValue<string> | null,
      votes?: null,
      lpSide?: null
    ): VoteEventFilter;
  };

  estimateGas: {
    addQuotaToken(
      token: PromiseOrValue<string>,
      minRate: PromiseOrValue<BigNumberish>,
      maxRate: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    changeQuotaTokenRateParams(
      token: PromiseOrValue<string>,
      minRate: PromiseOrValue<BigNumberish>,
      maxRate: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    epochFrozen(overrides?: CallOverrides): Promise<BigNumber>;

    epochLastUpdate(overrides?: CallOverrides): Promise<BigNumber>;

    getRates(
      tokens: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isTokenAdded(
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    pool(overrides?: CallOverrides): Promise<BigNumber>;

    quotaRateParams(
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setFrozenEpoch(
      status: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    unvote(
      user: PromiseOrValue<string>,
      votes: PromiseOrValue<BigNumberish>,
      extraData: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateEpoch(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    userTokenVotes(
      user: PromiseOrValue<string>,
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    version(overrides?: CallOverrides): Promise<BigNumber>;

    vote(
      user: PromiseOrValue<string>,
      votes: PromiseOrValue<BigNumberish>,
      extraData: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    voter(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    addQuotaToken(
      token: PromiseOrValue<string>,
      minRate: PromiseOrValue<BigNumberish>,
      maxRate: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    changeQuotaTokenRateParams(
      token: PromiseOrValue<string>,
      minRate: PromiseOrValue<BigNumberish>,
      maxRate: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    epochFrozen(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    epochLastUpdate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getRates(
      tokens: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isTokenAdded(
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    pool(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    quotaRateParams(
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setFrozenEpoch(
      status: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    unvote(
      user: PromiseOrValue<string>,
      votes: PromiseOrValue<BigNumberish>,
      extraData: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateEpoch(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    userTokenVotes(
      user: PromiseOrValue<string>,
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    version(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    vote(
      user: PromiseOrValue<string>,
      votes: PromiseOrValue<BigNumberish>,
      extraData: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    voter(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
