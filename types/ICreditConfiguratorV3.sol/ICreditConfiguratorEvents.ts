/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type { BaseContract, BigNumber, Signer, utils } from "ethers";
import type { EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export interface ICreditConfiguratorEventsInterface extends utils.Interface {
  functions: {};

  events: {
    "AddEmergencyLiquidator(address)": EventFragment;
    "AllowAdapter(address,address)": EventFragment;
    "AllowBorrowing()": EventFragment;
    "AllowToken(address)": EventFragment;
    "CreditConfiguratorUpgraded(address)": EventFragment;
    "ForbidAdapter(address,address)": EventFragment;
    "ForbidBorrowing()": EventFragment;
    "ForbidToken(address)": EventFragment;
    "QuoteToken(address)": EventFragment;
    "RemoveEmergencyLiquidator(address)": EventFragment;
    "ResetCumulativeLoss()": EventFragment;
    "ScheduleTokenLiquidationThresholdRamp(address,uint16,uint16,uint40,uint40)": EventFragment;
    "SetBorrowingLimits(uint256,uint256)": EventFragment;
    "SetBotList(address)": EventFragment;
    "SetCreditFacade(address)": EventFragment;
    "SetExpirationDate(uint40)": EventFragment;
    "SetMaxCumulativeLoss(uint128)": EventFragment;
    "SetMaxDebtPerBlockMultiplier(uint8)": EventFragment;
    "SetMaxEnabledTokens(uint8)": EventFragment;
    "SetPriceOracle(address)": EventFragment;
    "SetTokenLiquidationThreshold(address,uint16)": EventFragment;
    "SetTotalDebtLimit(uint128)": EventFragment;
    "UpdateFees(uint16,uint16,uint16,uint16,uint16)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AddEmergencyLiquidator"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AllowAdapter"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AllowBorrowing"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AllowToken"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CreditConfiguratorUpgraded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ForbidAdapter"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ForbidBorrowing"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ForbidToken"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "QuoteToken"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RemoveEmergencyLiquidator"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ResetCumulativeLoss"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "ScheduleTokenLiquidationThresholdRamp"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetBorrowingLimits"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetBotList"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetCreditFacade"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetExpirationDate"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetMaxCumulativeLoss"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "SetMaxDebtPerBlockMultiplier"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetMaxEnabledTokens"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetPriceOracle"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "SetTokenLiquidationThreshold"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetTotalDebtLimit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UpdateFees"): EventFragment;
}

export interface AddEmergencyLiquidatorEventObject {
  arg0: string;
}
export type AddEmergencyLiquidatorEvent = TypedEvent<
  [string],
  AddEmergencyLiquidatorEventObject
>;

export type AddEmergencyLiquidatorEventFilter =
  TypedEventFilter<AddEmergencyLiquidatorEvent>;

export interface AllowAdapterEventObject {
  targetContract: string;
  adapter: string;
}
export type AllowAdapterEvent = TypedEvent<
  [string, string],
  AllowAdapterEventObject
>;

export type AllowAdapterEventFilter = TypedEventFilter<AllowAdapterEvent>;

export interface AllowBorrowingEventObject {}
export type AllowBorrowingEvent = TypedEvent<[], AllowBorrowingEventObject>;

export type AllowBorrowingEventFilter = TypedEventFilter<AllowBorrowingEvent>;

export interface AllowTokenEventObject {
  token: string;
}
export type AllowTokenEvent = TypedEvent<[string], AllowTokenEventObject>;

export type AllowTokenEventFilter = TypedEventFilter<AllowTokenEvent>;

export interface CreditConfiguratorUpgradedEventObject {
  newCreditConfigurator: string;
}
export type CreditConfiguratorUpgradedEvent = TypedEvent<
  [string],
  CreditConfiguratorUpgradedEventObject
>;

export type CreditConfiguratorUpgradedEventFilter =
  TypedEventFilter<CreditConfiguratorUpgradedEvent>;

export interface ForbidAdapterEventObject {
  targetContract: string;
  adapter: string;
}
export type ForbidAdapterEvent = TypedEvent<
  [string, string],
  ForbidAdapterEventObject
>;

export type ForbidAdapterEventFilter = TypedEventFilter<ForbidAdapterEvent>;

export interface ForbidBorrowingEventObject {}
export type ForbidBorrowingEvent = TypedEvent<[], ForbidBorrowingEventObject>;

export type ForbidBorrowingEventFilter = TypedEventFilter<ForbidBorrowingEvent>;

export interface ForbidTokenEventObject {
  token: string;
}
export type ForbidTokenEvent = TypedEvent<[string], ForbidTokenEventObject>;

export type ForbidTokenEventFilter = TypedEventFilter<ForbidTokenEvent>;

export interface QuoteTokenEventObject {
  arg0: string;
}
export type QuoteTokenEvent = TypedEvent<[string], QuoteTokenEventObject>;

export type QuoteTokenEventFilter = TypedEventFilter<QuoteTokenEvent>;

export interface RemoveEmergencyLiquidatorEventObject {
  arg0: string;
}
export type RemoveEmergencyLiquidatorEvent = TypedEvent<
  [string],
  RemoveEmergencyLiquidatorEventObject
>;

export type RemoveEmergencyLiquidatorEventFilter =
  TypedEventFilter<RemoveEmergencyLiquidatorEvent>;

export interface ResetCumulativeLossEventObject {}
export type ResetCumulativeLossEvent = TypedEvent<
  [],
  ResetCumulativeLossEventObject
>;

export type ResetCumulativeLossEventFilter =
  TypedEventFilter<ResetCumulativeLossEvent>;

export interface ScheduleTokenLiquidationThresholdRampEventObject {
  token: string;
  liquidationThresholdInitial: number;
  liquidationThresholdFinal: number;
  timestampRampStart: number;
  timestampRampEnd: number;
}
export type ScheduleTokenLiquidationThresholdRampEvent = TypedEvent<
  [string, number, number, number, number],
  ScheduleTokenLiquidationThresholdRampEventObject
>;

export type ScheduleTokenLiquidationThresholdRampEventFilter =
  TypedEventFilter<ScheduleTokenLiquidationThresholdRampEvent>;

export interface SetBorrowingLimitsEventObject {
  minDebt: BigNumber;
  maxDebt: BigNumber;
}
export type SetBorrowingLimitsEvent = TypedEvent<
  [BigNumber, BigNumber],
  SetBorrowingLimitsEventObject
>;

export type SetBorrowingLimitsEventFilter =
  TypedEventFilter<SetBorrowingLimitsEvent>;

export interface SetBotListEventObject {
  arg0: string;
}
export type SetBotListEvent = TypedEvent<[string], SetBotListEventObject>;

export type SetBotListEventFilter = TypedEventFilter<SetBotListEvent>;

export interface SetCreditFacadeEventObject {
  newCreditFacade: string;
}
export type SetCreditFacadeEvent = TypedEvent<
  [string],
  SetCreditFacadeEventObject
>;

export type SetCreditFacadeEventFilter = TypedEventFilter<SetCreditFacadeEvent>;

export interface SetExpirationDateEventObject {
  arg0: number;
}
export type SetExpirationDateEvent = TypedEvent<
  [number],
  SetExpirationDateEventObject
>;

export type SetExpirationDateEventFilter =
  TypedEventFilter<SetExpirationDateEvent>;

export interface SetMaxCumulativeLossEventObject {
  arg0: BigNumber;
}
export type SetMaxCumulativeLossEvent = TypedEvent<
  [BigNumber],
  SetMaxCumulativeLossEventObject
>;

export type SetMaxCumulativeLossEventFilter =
  TypedEventFilter<SetMaxCumulativeLossEvent>;

export interface SetMaxDebtPerBlockMultiplierEventObject {
  arg0: number;
}
export type SetMaxDebtPerBlockMultiplierEvent = TypedEvent<
  [number],
  SetMaxDebtPerBlockMultiplierEventObject
>;

export type SetMaxDebtPerBlockMultiplierEventFilter =
  TypedEventFilter<SetMaxDebtPerBlockMultiplierEvent>;

export interface SetMaxEnabledTokensEventObject {
  arg0: number;
}
export type SetMaxEnabledTokensEvent = TypedEvent<
  [number],
  SetMaxEnabledTokensEventObject
>;

export type SetMaxEnabledTokensEventFilter =
  TypedEventFilter<SetMaxEnabledTokensEvent>;

export interface SetPriceOracleEventObject {
  newPriceOracle: string;
}
export type SetPriceOracleEvent = TypedEvent<
  [string],
  SetPriceOracleEventObject
>;

export type SetPriceOracleEventFilter = TypedEventFilter<SetPriceOracleEvent>;

export interface SetTokenLiquidationThresholdEventObject {
  token: string;
  liquidationThreshold: number;
}
export type SetTokenLiquidationThresholdEvent = TypedEvent<
  [string, number],
  SetTokenLiquidationThresholdEventObject
>;

export type SetTokenLiquidationThresholdEventFilter =
  TypedEventFilter<SetTokenLiquidationThresholdEvent>;

export interface SetTotalDebtLimitEventObject {
  arg0: BigNumber;
}
export type SetTotalDebtLimitEvent = TypedEvent<
  [BigNumber],
  SetTotalDebtLimitEventObject
>;

export type SetTotalDebtLimitEventFilter =
  TypedEventFilter<SetTotalDebtLimitEvent>;

export interface UpdateFeesEventObject {
  feeInterest: number;
  feeLiquidation: number;
  liquidationPremium: number;
  feeLiquidationExpired: number;
  liquidationPremiumExpired: number;
}
export type UpdateFeesEvent = TypedEvent<
  [number, number, number, number, number],
  UpdateFeesEventObject
>;

export type UpdateFeesEventFilter = TypedEventFilter<UpdateFeesEvent>;

export interface ICreditConfiguratorEvents extends BaseContract {
  contractName: "ICreditConfiguratorEvents";

  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ICreditConfiguratorEventsInterface;

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

  functions: {};

  callStatic: {};

  filters: {
    "AddEmergencyLiquidator(address)"(
      arg0?: null
    ): AddEmergencyLiquidatorEventFilter;
    AddEmergencyLiquidator(arg0?: null): AddEmergencyLiquidatorEventFilter;

    "AllowAdapter(address,address)"(
      targetContract?: PromiseOrValue<string> | null,
      adapter?: PromiseOrValue<string> | null
    ): AllowAdapterEventFilter;
    AllowAdapter(
      targetContract?: PromiseOrValue<string> | null,
      adapter?: PromiseOrValue<string> | null
    ): AllowAdapterEventFilter;

    "AllowBorrowing()"(): AllowBorrowingEventFilter;
    AllowBorrowing(): AllowBorrowingEventFilter;

    "AllowToken(address)"(
      token?: PromiseOrValue<string> | null
    ): AllowTokenEventFilter;
    AllowToken(token?: PromiseOrValue<string> | null): AllowTokenEventFilter;

    "CreditConfiguratorUpgraded(address)"(
      newCreditConfigurator?: PromiseOrValue<string> | null
    ): CreditConfiguratorUpgradedEventFilter;
    CreditConfiguratorUpgraded(
      newCreditConfigurator?: PromiseOrValue<string> | null
    ): CreditConfiguratorUpgradedEventFilter;

    "ForbidAdapter(address,address)"(
      targetContract?: PromiseOrValue<string> | null,
      adapter?: PromiseOrValue<string> | null
    ): ForbidAdapterEventFilter;
    ForbidAdapter(
      targetContract?: PromiseOrValue<string> | null,
      adapter?: PromiseOrValue<string> | null
    ): ForbidAdapterEventFilter;

    "ForbidBorrowing()"(): ForbidBorrowingEventFilter;
    ForbidBorrowing(): ForbidBorrowingEventFilter;

    "ForbidToken(address)"(
      token?: PromiseOrValue<string> | null
    ): ForbidTokenEventFilter;
    ForbidToken(token?: PromiseOrValue<string> | null): ForbidTokenEventFilter;

    "QuoteToken(address)"(arg0?: null): QuoteTokenEventFilter;
    QuoteToken(arg0?: null): QuoteTokenEventFilter;

    "RemoveEmergencyLiquidator(address)"(
      arg0?: null
    ): RemoveEmergencyLiquidatorEventFilter;
    RemoveEmergencyLiquidator(
      arg0?: null
    ): RemoveEmergencyLiquidatorEventFilter;

    "ResetCumulativeLoss()"(): ResetCumulativeLossEventFilter;
    ResetCumulativeLoss(): ResetCumulativeLossEventFilter;

    "ScheduleTokenLiquidationThresholdRamp(address,uint16,uint16,uint40,uint40)"(
      token?: PromiseOrValue<string> | null,
      liquidationThresholdInitial?: null,
      liquidationThresholdFinal?: null,
      timestampRampStart?: null,
      timestampRampEnd?: null
    ): ScheduleTokenLiquidationThresholdRampEventFilter;
    ScheduleTokenLiquidationThresholdRamp(
      token?: PromiseOrValue<string> | null,
      liquidationThresholdInitial?: null,
      liquidationThresholdFinal?: null,
      timestampRampStart?: null,
      timestampRampEnd?: null
    ): ScheduleTokenLiquidationThresholdRampEventFilter;

    "SetBorrowingLimits(uint256,uint256)"(
      minDebt?: null,
      maxDebt?: null
    ): SetBorrowingLimitsEventFilter;
    SetBorrowingLimits(
      minDebt?: null,
      maxDebt?: null
    ): SetBorrowingLimitsEventFilter;

    "SetBotList(address)"(arg0?: null): SetBotListEventFilter;
    SetBotList(arg0?: null): SetBotListEventFilter;

    "SetCreditFacade(address)"(
      newCreditFacade?: PromiseOrValue<string> | null
    ): SetCreditFacadeEventFilter;
    SetCreditFacade(
      newCreditFacade?: PromiseOrValue<string> | null
    ): SetCreditFacadeEventFilter;

    "SetExpirationDate(uint40)"(arg0?: null): SetExpirationDateEventFilter;
    SetExpirationDate(arg0?: null): SetExpirationDateEventFilter;

    "SetMaxCumulativeLoss(uint128)"(
      arg0?: null
    ): SetMaxCumulativeLossEventFilter;
    SetMaxCumulativeLoss(arg0?: null): SetMaxCumulativeLossEventFilter;

    "SetMaxDebtPerBlockMultiplier(uint8)"(
      arg0?: null
    ): SetMaxDebtPerBlockMultiplierEventFilter;
    SetMaxDebtPerBlockMultiplier(
      arg0?: null
    ): SetMaxDebtPerBlockMultiplierEventFilter;

    "SetMaxEnabledTokens(uint8)"(arg0?: null): SetMaxEnabledTokensEventFilter;
    SetMaxEnabledTokens(arg0?: null): SetMaxEnabledTokensEventFilter;

    "SetPriceOracle(address)"(
      newPriceOracle?: PromiseOrValue<string> | null
    ): SetPriceOracleEventFilter;
    SetPriceOracle(
      newPriceOracle?: PromiseOrValue<string> | null
    ): SetPriceOracleEventFilter;

    "SetTokenLiquidationThreshold(address,uint16)"(
      token?: PromiseOrValue<string> | null,
      liquidationThreshold?: null
    ): SetTokenLiquidationThresholdEventFilter;
    SetTokenLiquidationThreshold(
      token?: PromiseOrValue<string> | null,
      liquidationThreshold?: null
    ): SetTokenLiquidationThresholdEventFilter;

    "SetTotalDebtLimit(uint128)"(arg0?: null): SetTotalDebtLimitEventFilter;
    SetTotalDebtLimit(arg0?: null): SetTotalDebtLimitEventFilter;

    "UpdateFees(uint16,uint16,uint16,uint16,uint16)"(
      feeInterest?: null,
      feeLiquidation?: null,
      liquidationPremium?: null,
      feeLiquidationExpired?: null,
      liquidationPremiumExpired?: null
    ): UpdateFeesEventFilter;
    UpdateFees(
      feeInterest?: null,
      feeLiquidation?: null,
      liquidationPremium?: null,
      feeLiquidationExpired?: null,
      liquidationPremiumExpired?: null
    ): UpdateFeesEventFilter;
  };

  estimateGas: {};

  populateTransaction: {};
}
