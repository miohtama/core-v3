// SPDX-License-Identifier: BUSL-1.1
// Gearbox Protocol. Generalized leverage for DeFi protocols
// (c) Gearbox Foundation, 2023.
pragma solidity ^0.8.17;

// THIRD-PARTY
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {SafeCast} from "@openzeppelin/contracts/utils/math/SafeCast.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@1inch/solidity-utils/contracts/libraries/SafeERC20.sol";

// LIBS & TRAITS
import {BalancesLogic, Balance, BalanceWithMask} from "../libraries/BalancesLogic.sol";
import {ACLNonReentrantTrait} from "../traits/ACLNonReentrantTrait.sol";
import {BitMask, UNDERLYING_TOKEN_MASK} from "../libraries/BitMask.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

// INTERFACES
import "../interfaces/ICreditFacadeV3.sol";
import "../interfaces/IAddressProviderV3.sol";
import {
    ICreditManagerV3,
    ClosureAction,
    ManageDebtAction,
    RevocationPair,
    CollateralDebtData,
    CollateralCalcTask,
    BOT_PERMISSIONS_SET_FLAG,
    INACTIVE_CREDIT_ACCOUNT_ADDRESS
} from "../interfaces/ICreditManagerV3.sol";
import {AllowanceAction} from "../interfaces/ICreditConfiguratorV3.sol";
import {ClaimAction, ETH_ADDRESS, IWithdrawalManagerV3} from "../interfaces/IWithdrawalManagerV3.sol";
import {IPriceOracleBase} from "@gearbox-protocol/core-v2/contracts/interfaces/IPriceOracleBase.sol";
import {IUpdatablePriceFeed} from "@gearbox-protocol/core-v2/contracts/interfaces/IPriceFeed.sol";

import {IPoolV3} from "../interfaces/IPoolV3.sol";
import {IDegenNFTV2} from "@gearbox-protocol/core-v2/contracts/interfaces/IDegenNFTV2.sol";
import {IWETH} from "@gearbox-protocol/core-v2/contracts/interfaces/external/IWETH.sol";
import {IBotListV3} from "../interfaces/IBotListV3.sol";

// CONSTANTS
import {PERCENTAGE_FACTOR} from "@gearbox-protocol/core-v2/contracts/libraries/Constants.sol";

// EXCEPTIONS
import "../interfaces/IExceptions.sol";

uint256 constant OPEN_CREDIT_ACCOUNT_FLAGS =
    ALL_PERMISSIONS & ~(INCREASE_DEBT_PERMISSION | DECREASE_DEBT_PERMISSION | WITHDRAW_PERMISSION);

uint256 constant CLOSE_CREDIT_ACCOUNT_FLAGS = EXTERNAL_CALLS_PERMISSION;

// TODO: describe facade features:
// multicalls
// bots
// security: quotas/debt size validation, pause on loss, degen NFT, forbidden tokens
// weth
// expiration

/// @title CreditFacadeV3
/// @notice A contract that provides a user interface for interacting with Credit Manager.
/// @dev CreditFacadeV3 provides an interface between the user and the Credit Manager. Direct interactions
/// with the Credit Manager are forbidden. Credit Facade provides access to all account management functions,
/// opening, closing, liquidating, managing debt, as well as calls to external protocols (through adapters, which
/// also can't be interacted with directly). All of these actions are only accessible through `multicall`.
contract CreditFacadeV3 is ICreditFacadeV3, ACLNonReentrantTrait {
    using Address for address;
    using BitMask for uint256;
    using SafeCast for uint256;
    using SafeERC20 for IERC20;

    /// @notice Contract version
    uint256 public constant override version = 3_00;

    /// @notice Maximum quota size, as a multiple of `maxDebt`
    uint256 public constant override maxQuotaMultiplier = 8;

    /// @notice Maximum number of approved bots for a credit account
    uint256 public constant override maxApprovedBots = 5;

    /// @notice Credit manager connected to this credit facade
    address public immutable override creditManager;

    /// @notice Whether credit facade is expirable
    bool public immutable override expirable;

    /// @notice WETH token address
    address public immutable override weth;

    /// @notice Withdrawal manager address
    address public immutable override withdrawalManager;

    /// @notice Degen NFT address
    address public immutable override degenNFT;

    /// @notice Expiration timestamp
    uint40 public override expirationDate;

    /// @notice Maximum amount that can be borrowed by a credit manager in a single block, as a multiple of `maxDebt`
    uint8 public override maxDebtPerBlockMultiplier;

    /// @notice Last block when underlying was borrowed by a credit manager
    uint64 internal lastBlockBorrowed;

    /// @notice The total amount borrowed by a credit manager in `lastBlockBorrowed`
    uint128 internal totalBorrowedInBlock;

    /// @notice Bot list address
    address public override botList;

    /// @notice Credit account debt limits packed into a single slot
    DebtLimits public override debtLimits;

    /// @notice Bit mask encoding a set of forbidden tokens
    uint256 public override forbiddenTokenMask;

    /// @notice Info on bad debt liquidation losses packed into a single slot
    CumulativeLossParams public override lossParams;

    /// @notice Mapping account => emergency liquidator status
    mapping(address => bool) public override canLiquidateWhilePaused;

    /// @dev Ensures that function caller is credit configurator
    modifier creditConfiguratorOnly() {
        _checkCreditConfigurator();
        _;
    }

    /// @dev Ensures that function caller is `creditAccount`'s owner
    modifier creditAccountOwnerOnly(address creditAccount) {
        _checkCreditAccountOwner(creditAccount);
        _;
    }

    /// @dev Ensures that function can't be called when the contract is paused, unless caller is an emergency liquidator
    modifier whenNotPausedOrEmergency() {
        require(!paused() || canLiquidateWhilePaused[msg.sender], "Pausable: paused");
        _;
    }

    /// @dev Ensures that function can't be called when the contract is expired
    modifier whenNotExpired() {
        _checkExpired();
        _;
    }

    /// @dev Wraps any ETH sent in a function call and sends it back to the caller
    modifier wrapETH() {
        _wrapETH();
        _;
    }

    /// @notice Constructor
    /// @param _creditManager Credit manager to connect this facade to
    /// @param _degenNFT Degen NFT address or `address(0)`
    /// @param _expirable Whether this facade should be expirable
    constructor(address _creditManager, address _degenNFT, bool _expirable)
        ACLNonReentrantTrait(ICreditManagerV3(_creditManager).addressProvider())
    {
        creditManager = _creditManager; // U:[FA-1]

        weth = ICreditManagerV3(_creditManager).weth(); // U:[FA-1]
        withdrawalManager = ICreditManagerV3(_creditManager).withdrawalManager(); // U:[FA-1]
        botList =
            IAddressProviderV3(ICreditManagerV3(_creditManager).addressProvider()).getAddressOrRevert(AP_BOT_LIST, 3_00);

        degenNFT = _degenNFT; // U:[FA-1]

        expirable = _expirable; // U:[FA-1]
    }

    // ------------------ //
    // ACCOUNT MANAGEMENT //
    // ------------------ //

    // START TODO

    /// @notice Opens a Credit Account and runs a batch of operations in a multicall
    /// - Performs sanity checks
    /// - Burns IDegenNFTV2 (in whitelisted mode)
    /// - Opens credit account with the desired debt amount
    /// - Executes all operations in a multicall
    /// - Checks that the new account has enough collateral
    /// - Emits OpenCreditAccount event
    ///
    /// @param debt Debt size
    /// @param onBehalfOf The address to open an account for
    /// @param calls The array of MultiCall structs encoding the required operations. Generally must have
    /// at least a call to addCollateral, as otherwise the health check at the end will fail.
    /// @param referralCode Referral code that is used for potential rewards. 0 if no referral code provided
    /// @return creditAccount The address of the newly opened account
    function openCreditAccount(uint256 debt, address onBehalfOf, MultiCall[] calldata calls, uint16 referralCode)
        external
        payable
        override
        whenNotPaused // U:[FA-2]
        whenNotExpired // U:[FA-3]
        nonReentrant // U:[FA-4]
        wrapETH // U:[FA-7]
        returns (address creditAccount)
    {
        // Checks that the borrowed amount is within the debt limits
        _revertIfOutOfDebtLimits(debt); // U:[FA-8]

        // Checks whether the new borrowed amount does not violate the block limit
        _revertIfOutOfBorrowingLimit(debt); // U:[FA-11]

        /// Attempts to burn the IDegenNFTV2 - if onBehalfOf has none, this will fail
        if (degenNFT != address(0)) {
            if (msg.sender != onBehalfOf) {
                revert ForbiddenInWhitelistedModeException();
            } // U:[FA-9]
            IDegenNFTV2(degenNFT).burn(onBehalfOf, 1); // U:[FA-9]
        }

        creditAccount = ICreditManagerV3(creditManager).openCreditAccount({debt: debt, onBehalfOf: onBehalfOf}); // U:[FA-10]

        emit OpenCreditAccount(creditAccount, onBehalfOf, msg.sender, debt, referralCode); // U:[FA-10]

        // same as `_multicallFullCollateralCheck` but leverages the fact that account is freshly opened to save gas
        BalanceWithMask[] memory forbiddenBalances;

        uint256 skipCalls = _applyOnDemandPriceUpdates(calls);
        FullCheckParams memory fullCheckParams = _multicall({
            creditAccount: creditAccount,
            calls: calls,
            enabledTokensMask: debt == 0 ? 0 : UNDERLYING_TOKEN_MASK,
            flags: OPEN_CREDIT_ACCOUNT_FLAGS,
            skip: skipCalls
        }); // U:[FA-10]

        _fullCollateralCheck({
            creditAccount: creditAccount,
            enabledTokensMaskBefore: UNDERLYING_TOKEN_MASK,
            fullCheckParams: fullCheckParams,
            forbiddenBalances: forbiddenBalances,
            _forbiddenTokenMask: forbiddenTokenMask
        }); // U:[FA-10]
    }

    /// @notice Runs a batch of transactions within a multicall and closes the account
    /// - Retrieves all debt data from the Credit Manager, such as debt and accrued interest and fees
    /// - Forces all pending withdrawals, even if they are not mature yet: successful account closure means
    ///   that there was enough collateral on the account to fully repay all debt - so this action is safe
    /// - Executes the multicall - the main purpose of a multicall when closing is to convert assets to underlying
    ///   in order to pay the debt.
    /// - Erases all bot permissions from an account, to protect future users from potentially unwanted bot permissions
    /// - Closes credit account:
    ///    + Checks the underlying balance: if it is greater than the amount paid to the pool, transfers the underlying
    ///      from the Credit Account and proceeds. If not, tries to transfer the shortfall from msg.sender;
    ///    + If active quotas are present, they are all set to zero;
    ///    + Transfers all enabled assets with non-zero balances to the "to" address, unless they are marked
    ///      to be skipped in skipTokenMask
    ///    + If convertToETH is true, converts WETH into ETH before sending to the recipient
    ///    + Returns the Credit Account to the factory
    /// - Emits a CloseCreditAccount event
    ///
    /// @param creditAccount Address of the Credit Account to liquidate. This is required, as V3 allows a borrower to
    ///                      have several CAs with one Credit Manager
    /// @param to Address to send funds to during account closing
    /// @param skipTokenMask Uint-encoded bit mask where 1's mark tokens that shouldn't be transferred
    /// @param convertToETH If true, converts WETH into ETH before sending to "to"
    /// @param calls The array of MultiCall structs encoding the operations to execute before closing the account.
    function closeCreditAccount(
        address creditAccount,
        address to,
        uint256 skipTokenMask,
        bool convertToETH,
        MultiCall[] calldata calls
    )
        external
        payable
        override
        creditAccountOwnerOnly(creditAccount) // U:[FA-5]
        whenNotPaused // U:[FA-2]
        nonReentrant // U:[FA-4]
        wrapETH // U:[FA-7]
    {
        /// Requests CM to calculate debt only, since we don't need to know the collateral value for
        /// full account closure
        CollateralDebtData memory debtData = _calcDebtAndCollateral(creditAccount, CollateralCalcTask.DEBT_ONLY); // U:[FA-11]

        /// All pending withdrawals are claimed, even if they are not yet mature
        _claimWithdrawals(creditAccount, to, ClaimAction.FORCE_CLAIM); // U:[FA-11]

        if (calls.length != 0) {
            // Price feed updates
            uint256 skipCalls = _applyOnDemandPriceUpdates(calls);

            /// All account management functions are forbidden during closure
            FullCheckParams memory fullCheckParams =
                _multicall(creditAccount, calls, debtData.enabledTokensMask, CLOSE_CREDIT_ACCOUNT_FLAGS, skipCalls); // U:[FA-11]
            debtData.enabledTokensMask = fullCheckParams.enabledTokensMaskAfter; // U:[FA-11]
        }

        /// Bot permissions are specific to (owner, creditAccount),
        /// so they need to be erased on account closure
        _eraseAllBotPermissions({creditAccount: creditAccount}); // U:[FA-11]

        // Requests the Credit manager to close the Credit Account
        _closeCreditAccount({
            creditAccount: creditAccount,
            closureAction: ClosureAction.CLOSE_ACCOUNT,
            collateralDebtData: debtData,
            payer: msg.sender,
            to: to,
            skipTokensMask: skipTokenMask,
            convertToETH: convertToETH
        }); // U:[FA-11]

        if (convertToETH) {
            _wethWithdrawTo(to); // U:[FA-11]
        }

        // Emits an event
        emit CloseCreditAccount(creditAccount, msg.sender, to); // U:[FA-11]
    }

    /// @notice Runs a batch of transactions within a multicall and liquidates the account
    /// - Applies on-demand price feed updates if any are found in the multicall.
    /// - Computes the total value and checks that hf < 1. An account can't be liquidated when hf >= 1.
    ///   Total value has to be computed before the multicall, otherwise the liquidator would be able
    ///   to manipulate it. Withdrawals are included into the total value according to the following logic
    ///    + If the liquidation is normal, then only non-mature withdrawals are included. This means
    ///      that if the CA has enough collateral INCLUDING immature withdrawals, then it is considered healthy.
    ///    + If the liquidation is emergency, then ALL withdrawals are included. If an attack attempt was performed and
    ///      the attacker scheduled a malicious withdrawal, this ensures that the funds can be recovered (by force cancelling the withdrawal)
    ///      even if this withdrawal matures while a response is being coordinated.
    /// - Cancels or claims withdrawals based on liquidation type:
    ///    + If this is a normal liquidation, then mature pending withdrawals are claimed and immature ones are cancelled and returned to the Credit Account
    ///    + If this is an emergency liquidation, all pending withdrawals (regardless of maturity) are returned to the CA
    /// - Executes the multicall - the main purpose of a multicall when liquidating is to convert all assets to underlying
    ///   in order to pay the debt.
    /// - Erases all bot permissions from an account, to protect future users from potentially unwanted bot permissions
    /// - Liquidate credit account:
    ///    + Computes the amount that needs to be paid to the pool. If totalValue * liquidationDiscount < borrow + interest + fees,
    ///      only totalValue * liquidationDiscount has to be paid. Since liquidationDiscount < 1, the liquidator can take
    ///      totalValue * (1 - liquidationDiscount) as premium. Also computes the remaining funds to be sent to borrower
    ///      as totalValue * liquidationDiscount - amountToPool.
    ///    + Checks the underlying balance: if it is greater than amountToPool + remainingFunds, transfers the underlying
    ///      from the Credit Account and proceeds. If not, tries to transfer the shortfall from the liquidator.
    ///    + Transfers all enabled assets with non-zero balances to the "to" address, unless they are marked
    ///      to be skipped in skipTokenMask. If the liquidator is confident that all assets were converted
    ///      during the multicall, they can set the mask to uint256.max - 1, to only transfer the underlying
    ///    + If active quotas are present, they are all set to zero;
    ///    + If convertToETH is true, converts WETH into ETH before sending
    ///    + Returns the Credit Account to the factory
    /// - If liquidation reported a loss, borrowing is prohibited and the cumulative loss value is increase;
    ///   If cumulative loss reaches a critical threshold, the system is paused
    /// - Emits LiquidateCreditAccount event
    ///
    /// @param creditAccount Credit Account to liquidate
    /// @param to Address to send funds to after liquidation
    /// @param skipTokenMask Uint-encoded bit mask where 1's mark tokens that shouldn't be transferred
    /// @param convertToETH If true, converts WETH into ETH before sending to "to"
    /// @param calls The array of MultiCall structs encoding the operations to execute before liquidating the account.
    function liquidateCreditAccount(
        address creditAccount,
        address to,
        uint256 skipTokenMask,
        bool convertToETH,
        MultiCall[] calldata calls
    )
        external
        override
        whenNotPausedOrEmergency // U:[FA-2,12]
        nonReentrant // U:[FA-4]
    {
        // Checks that the CA exists to revert early for late liquidations and save gas
        address borrower = _getBorrowerOrRevert(creditAccount); // U:[FA-5]

        // Price feed updates
        uint256 skipCalls = _applyOnDemandPriceUpdates(calls);

        // Checks that the account hf < 1 and computes the totalValue
        // before the multicall
        ClosureAction closeAction;
        CollateralDebtData memory collateralDebtData;
        {
            bool isEmergency = paused();

            collateralDebtData = _calcDebtAndCollateral(
                creditAccount,
                isEmergency
                    ? CollateralCalcTask.DEBT_COLLATERAL_FORCE_CANCEL_WITHDRAWALS
                    : CollateralCalcTask.DEBT_COLLATERAL_CANCEL_WITHDRAWALS
            ); // U:[FA-15]

            closeAction = ClosureAction.LIQUIDATE_ACCOUNT; // U:[FA-14]

            bool isLiquidatable = collateralDebtData.twvUSD < collateralDebtData.totalDebtUSD; // U:[FA-13]

            if (!isLiquidatable && _isExpired()) {
                isLiquidatable = true; // U:[FA-13]
                closeAction = ClosureAction.LIQUIDATE_EXPIRED_ACCOUNT; // U:[FA-14]
            }

            if (!isLiquidatable) revert CreditAccountNotLiquidatableException(); // U:[FA-13]

            uint256 tokensToEnable = _claimWithdrawals({
                action: isEmergency ? ClaimAction.FORCE_CANCEL : ClaimAction.CANCEL,
                creditAccount: creditAccount,
                to: borrower
            }); // U:[FA-15]

            collateralDebtData.enabledTokensMask = collateralDebtData.enabledTokensMask.enable(tokensToEnable); // U:[FA-15]
        }

        if (skipCalls < calls.length) {
            FullCheckParams memory fullCheckParams = _multicall(
                creditAccount, calls, collateralDebtData.enabledTokensMask, CLOSE_CREDIT_ACCOUNT_FLAGS, skipCalls
            ); // U:[FA-16]
            collateralDebtData.enabledTokensMask = fullCheckParams.enabledTokensMaskAfter; // U:[FA-16]
        }
        /// Bot permissions are specific to (owner, creditAccount),
        /// so they need to be erased on account closure
        _eraseAllBotPermissions({creditAccount: creditAccount}); // U:[FA-16]

        /// In this case only the liquidator's funds are sent to `to`, while the remaining
        /// funds are sent to the original borrower
        (uint256 remainingFunds, uint256 reportedLoss) = _closeCreditAccount({
            creditAccount: creditAccount,
            closureAction: closeAction,
            collateralDebtData: collateralDebtData,
            payer: msg.sender,
            to: to,
            skipTokensMask: skipTokenMask,
            convertToETH: convertToETH
        }); // U:[FA-16]

        /// If there is non-zero loss, then borrowing is forbidden in
        /// case this is an attack and there is risk of copycats afterwards
        /// If cumulative loss exceeds maxCumulativeLoss, the CF is paused,
        /// which ensures that the attacker can create at most maxCumulativeLoss + maxDebt of bad debt
        if (reportedLoss > 0) {
            maxDebtPerBlockMultiplier = 0; // U:[FA-17]

            /// reportedLoss is always less than uint128, because
            /// maxLoss = maxBorrowAmount which is uint128
            lossParams.currentCumulativeLoss += uint128(reportedLoss); // U:[FA-17]
            if (lossParams.currentCumulativeLoss > lossParams.maxCumulativeLoss) {
                _pause(); // U:[FA-17]
            }
        }

        if (convertToETH) {
            _wethWithdrawTo(to); // U:[FA-16]
        }

        emit LiquidateCreditAccount(creditAccount, borrower, msg.sender, to, closeAction, remainingFunds); // U:[FA-14,16,17]
    }

    /// @notice Executes a batch of transactions within a Multicall, to manage an existing account
    ///  - Wraps ETH and sends it back to msg.sender, if value > 0
    ///  - Executes the Multicall
    ///  - Performs a fullCollateralCheck to verify that hf > 1 after all actions
    /// @param calls The array of MultiCall structs encoding the operations to execute.
    function multicall(address creditAccount, MultiCall[] calldata calls)
        external
        payable
        override
        creditAccountOwnerOnly(creditAccount) // U:[FA-5]
        whenNotPaused // U:[FA-2]
        whenNotExpired // U:[FA-3]
        nonReentrant // U:[FA-4]
        wrapETH // U:[FA-7]
    {
        _multicallFullCollateralCheck(creditAccount, calls, ALL_PERMISSIONS); // U:[FA-18]
    }

    /// @notice Executes a batch of transactions within a Multicall from bot on behalf of a Credit Account's owner
    ///  - Retrieves bot permissions from botList and checks whether it is forbidden
    ///  - Executes the Multicall, with actions limited to `botPermissions`
    ///  - Performs a fullCollateralCheck to verify that hf > 1 after all actions
    /// @param creditAccount Address of credit account
    /// @param calls The array of MultiCall structs encoding the operations to execute.
    function botMulticall(address creditAccount, MultiCall[] calldata calls)
        external
        override
        whenNotPaused // U:[FA-2]
        whenNotExpired // U:[FA-3]
        nonReentrant // U:[FA-4]
    {
        (uint256 botPermissions, bool forbidden, bool hasSpecialPermissions) = IBotListV3(botList).getBotStatus({
            creditManager: creditManager,
            creditAccount: creditAccount,
            bot: msg.sender
        });

        // Checks that the bot is approved by the borrower (or has special permissions from DAO) and is not forbidden
        if (
            botPermissions == 0 || forbidden
                || (!hasSpecialPermissions && (_flagsOf(creditAccount) & BOT_PERMISSIONS_SET_FLAG == 0))
        ) {
            revert NotApprovedBotException(); // U:[FA-19]
        }

        if (!hasSpecialPermissions) {
            botPermissions = botPermissions.enable(PAY_BOT_CAN_BE_CALLED);
        }

        _multicallFullCollateralCheck(creditAccount, calls, botPermissions); // U:[FA-19, 20]
    }

    /// @notice Claims all mature delayed withdrawals, transferring funds from
    ///      withdrawal manager to the address provided by the CA owner
    /// @param creditAccount CA to claim withdrawals for
    /// @param to Address to transfer the withdrawals to
    function claimWithdrawals(address creditAccount, address to)
        external
        override
        creditAccountOwnerOnly(creditAccount) // U:[FA-5]
        whenNotPaused // U:[FA-2]
        nonReentrant // U:[FA-4]
    {
        _claimWithdrawals(creditAccount, to, ClaimAction.CLAIM); // U:[FA-40]
    }

    /// @notice Sets permissions and funding parameters for a bot
    ///      Also manages BOT_PERMISSIONS_SET_FLAG, to allow
    ///      the contracts to determine whether a CA has permissions for any bot
    /// @param creditAccount CA to set permissions for
    /// @param bot Bot to set permissions for
    /// @param permissions A bit mask of permissions
    /// @param totalFundingAllowance Total amount of ETH available to the bot for payments
    /// @param weeklyFundingAllowance Amount of ETH available to the bot weekly
    /// @dev Reverts if account has more active bots than allowed after changing permissions
    //       to prevent users from inflating liquidation gas costs
    function setBotPermissions(
        address creditAccount,
        address bot,
        uint192 permissions,
        uint72 totalFundingAllowance,
        uint72 weeklyFundingAllowance
    )
        external
        override
        creditAccountOwnerOnly(creditAccount) // U:[FA-5]
        nonReentrant // U:[FA-4]
    {
        uint256 remainingBots = IBotListV3(botList).setBotPermissions({
            creditManager: creditManager,
            creditAccount: creditAccount,
            bot: bot,
            permissions: permissions,
            totalFundingAllowance: totalFundingAllowance,
            weeklyFundingAllowance: weeklyFundingAllowance
        }); // U:[FA-41]

        if (remainingBots > maxApprovedBots) {
            revert TooManyApprovedBotsException(); // U:[FA-41]
        }

        if (remainingBots == 0) {
            _setFlagFor({creditAccount: creditAccount, flag: BOT_PERMISSIONS_SET_FLAG, value: false}); // U:[FA-41]
        } else if (_flagsOf(creditAccount) & BOT_PERMISSIONS_SET_FLAG == 0) {
            _setFlagFor({creditAccount: creditAccount, flag: BOT_PERMISSIONS_SET_FLAG, value: true}); // U:[FA-41]
        }
    }

    // END TODO

    // --------- //
    // MULTICALL //
    // --------- //

    /// @dev Batches price feed updates, multicall and collateral check into a single function
    function _multicallFullCollateralCheck(address creditAccount, MultiCall[] calldata calls, uint256 flags) internal {
        uint256 _forbiddenTokenMask = forbiddenTokenMask;
        uint256 enabledTokensMaskBefore = ICreditManagerV3(creditManager).enabledTokensMaskOf(creditAccount); // U:[FA-18]
        BalanceWithMask[] memory forbiddenBalances = BalancesLogic.storeForbiddenBalances({
            creditAccount: creditAccount,
            forbiddenTokenMask: _forbiddenTokenMask,
            enabledTokensMask: enabledTokensMaskBefore,
            getTokenByMaskFn: _getTokenByMask
        });

        uint256 skipCalls = _applyOnDemandPriceUpdates(calls);
        FullCheckParams memory fullCheckParams = _multicall(
            creditAccount,
            calls,
            enabledTokensMaskBefore,
            forbiddenBalances.length != 0 ? flags.enable(FORBIDDEN_TOKENS_BEFORE_CALLS) : flags,
            skipCalls
        );

        _fullCollateralCheck({
            creditAccount: creditAccount,
            enabledTokensMaskBefore: enabledTokensMaskBefore,
            fullCheckParams: fullCheckParams,
            forbiddenBalances: forbiddenBalances,
            _forbiddenTokenMask: _forbiddenTokenMask
        }); // U:[FA-18]
    }

    /// @dev Multicall implementation
    /// @param creditAccount Account to perform actions with
    /// @param calls Array of `(target, callData)` tuples representing a sequence of calls to perform
    ///        - if `target` is this contract's address, `callData` must be an ABI-encoded calldata of a method
    ///          from `ICreditFacadeV3Multicall`, which is dispatched and handled appropriately
    ///        - otherwise, `target` must be an allowed adapter, which is then called with `callData`
    /// @param enabledTokensMask Bitmask of account's enabled collateral tokens before the multicall
    /// @param flags Permissions and flags that dictate what methods can be called
    /// @param skip The number of calls that can be skipped (see `_applyOnDemandPriceUpdates`)
    /// @return fullCheckParams Collateral check parameters, see `FullCheckParams` for details
    function _multicall(
        address creditAccount,
        MultiCall[] calldata calls,
        uint256 enabledTokensMask,
        uint256 flags,
        uint256 skip
    ) internal returns (FullCheckParams memory fullCheckParams) {
        emit StartMultiCall({creditAccount: creditAccount, caller: msg.sender}); // U:[FA-18]

        uint256 quotedTokensMaskInverted;
        Balance[] memory expectedBalances;
        fullCheckParams.minHealthFactor = PERCENTAGE_FACTOR;

        unchecked {
            uint256 len = calls.length;
            for (uint256 i = skip; i < len; ++i) {
                MultiCall calldata mcall = calls[i];

                // credit facade calls
                if (mcall.target == address(this)) {
                    bytes4 method = bytes4(mcall.callData);

                    // revertIfReceivedLessThan
                    if (method == ICreditFacadeV3Multicall.revertIfReceivedLessThan.selector) {
                        if (expectedBalances.length != 0) {
                            revert ExpectedBalancesAlreadySetException(); // U:[FA-23]
                        }

                        Balance[] memory balanceDeltas = abi.decode(mcall.callData[4:], (Balance[])); // U:[FA-23]
                        expectedBalances = BalancesLogic.storeBalances(creditAccount, balanceDeltas); // U:[FA-23]
                    }
                    // addCollateral
                    else if (method == ICreditFacadeV3Multicall.addCollateral.selector) {
                        _revertIfNoPermission(flags, ADD_COLLATERAL_PERMISSION); // U:[FA-21]

                        quotedTokensMaskInverted = _getInvertedQuotedTokensMask(quotedTokensMaskInverted);

                        enabledTokensMask = enabledTokensMask.enable({
                            bitsToEnable: _addCollateral(creditAccount, mcall.callData[4:]),
                            invertedSkipMask: quotedTokensMaskInverted
                        }); // U:[FA-26]
                    }
                    // updateQuota
                    else if (method == ICreditFacadeV3Multicall.updateQuota.selector) {
                        _revertIfNoPermission(flags, UPDATE_QUOTA_PERMISSION); // U:[FA-21]

                        (uint256 tokensToEnable, uint256 tokensToDisable) =
                            _updateQuota(creditAccount, mcall.callData[4:], flags & FORBIDDEN_TOKENS_BEFORE_CALLS != 0); // U:[FA-34]
                        enabledTokensMask = enabledTokensMask.enableDisable(tokensToEnable, tokensToDisable); // U:[FA-34]
                    }
                    // scheduleWithdrawal
                    else if (method == ICreditFacadeV3Multicall.scheduleWithdrawal.selector) {
                        _revertIfNoPermission(flags, WITHDRAW_PERMISSION); // U:[FA-21]

                        flags = flags.enable(REVERT_ON_FORBIDDEN_TOKENS_AFTER_CALLS);

                        uint256 tokensToDisable = _scheduleWithdrawal(creditAccount, mcall.callData[4:]); // U:[FA-34]

                        quotedTokensMaskInverted = _getInvertedQuotedTokensMask(quotedTokensMaskInverted);

                        enabledTokensMask = enabledTokensMask.disable({
                            bitsToDisable: tokensToDisable,
                            invertedSkipMask: quotedTokensMaskInverted
                        }); // U:[FA-35]
                    }
                    // increaseDebt
                    else if (method == ICreditFacadeV3Multicall.increaseDebt.selector) {
                        _revertIfNoPermission(flags, INCREASE_DEBT_PERMISSION); // U:[FA-21]

                        flags = flags.enable(REVERT_ON_FORBIDDEN_TOKENS_AFTER_CALLS).disable(DECREASE_DEBT_PERMISSION); // U:[FA-29]

                        (uint256 tokensToEnable,) = _manageDebt(
                            creditAccount, mcall.callData[4:], enabledTokensMask, ManageDebtAction.INCREASE_DEBT
                        ); // U:[FA-27]
                        enabledTokensMask = enabledTokensMask.enable(tokensToEnable); // U:[FA-27]
                    }
                    // decreaseDebt
                    else if (method == ICreditFacadeV3Multicall.decreaseDebt.selector) {
                        _revertIfNoPermission(flags, DECREASE_DEBT_PERMISSION); // U:[FA-21]

                        (, uint256 tokensToDisable) = _manageDebt(
                            creditAccount, mcall.callData[4:], enabledTokensMask, ManageDebtAction.DECREASE_DEBT
                        ); // U:[FA-31]
                        enabledTokensMask = enabledTokensMask.disable(tokensToDisable); // U:[FA-31]
                    }
                    // payBot
                    else if (method == ICreditFacadeV3Multicall.payBot.selector) {
                        _revertIfNoPermission(flags, PAY_BOT_CAN_BE_CALLED); // U:[FA-21]
                        flags = flags.disable(PAY_BOT_CAN_BE_CALLED); // U:[FA-37]
                        _payBot(creditAccount, mcall.callData[4:]); // U:[FA-37]
                    }
                    // setFullCheckParams
                    else if (method == ICreditFacadeV3Multicall.setFullCheckParams.selector) {
                        (fullCheckParams.collateralHints, fullCheckParams.minHealthFactor) =
                            abi.decode(mcall.callData[4:], (uint256[], uint16)); // U:[FA-24]
                    }
                    // enableToken
                    else if (method == ICreditFacadeV3Multicall.enableToken.selector) {
                        _revertIfNoPermission(flags, ENABLE_TOKEN_PERMISSION); // U:[FA-21]
                        address token = abi.decode(mcall.callData[4:], (address)); // U:[FA-33]

                        quotedTokensMaskInverted = _getInvertedQuotedTokensMask(quotedTokensMaskInverted);

                        enabledTokensMask = enabledTokensMask.enable({
                            bitsToEnable: _getTokenMaskOrRevert(token),
                            invertedSkipMask: quotedTokensMaskInverted
                        }); // U:[FA-33]
                    }
                    // disableToken
                    else if (method == ICreditFacadeV3Multicall.disableToken.selector) {
                        _revertIfNoPermission(flags, DISABLE_TOKEN_PERMISSION); // U:[FA-21]
                        address token = abi.decode(mcall.callData[4:], (address)); // U:[FA-33]

                        quotedTokensMaskInverted = _getInvertedQuotedTokensMask(quotedTokensMaskInverted);

                        enabledTokensMask = enabledTokensMask.disable({
                            bitsToDisable: _getTokenMaskOrRevert(token),
                            invertedSkipMask: quotedTokensMaskInverted
                        }); // U:[FA-33]
                    }
                    // revokeAdapterAllowances
                    else if (method == ICreditFacadeV3Multicall.revokeAdapterAllowances.selector) {
                        _revertIfNoPermission(flags, REVOKE_ALLOWANCES_PERMISSION); // U:[FA-21]
                        _revokeAdapterAllowances(creditAccount, mcall.callData[4:]); // U:[FA-36]
                    }
                    // unknown method
                    else {
                        revert UnknownMethodException(); // U:[FA-22]
                    }
                }
                // adapter calls
                else {
                    _revertIfNoPermission(flags, EXTERNAL_CALLS_PERMISSION); // U:[FA-21]

                    bytes memory result;
                    {
                        address targetContract = ICreditManagerV3(creditManager).adapterToContract(mcall.target);
                        if (targetContract == address(0)) {
                            revert TargetContractNotAllowedException();
                        }

                        if (flags & EXTERNAL_CONTRACT_WAS_CALLED == 0) {
                            flags = flags.enable(EXTERNAL_CONTRACT_WAS_CALLED);
                            _setActiveCreditAccount(creditAccount); // U:[FA-38]
                        }

                        result = mcall.target.functionCall(mcall.callData); // U:[FA-38]

                        emit Execute({creditAccount: creditAccount, targetContract: targetContract});
                    }

                    (uint256 tokensToEnable, uint256 tokensToDisable) = abi.decode(result, (uint256, uint256)); // U:[FA-38]

                    quotedTokensMaskInverted = _getInvertedQuotedTokensMask(quotedTokensMaskInverted);

                    enabledTokensMask = enabledTokensMask.enableDisable({
                        bitsToEnable: tokensToEnable,
                        bitsToDisable: tokensToDisable,
                        invertedSkipMask: quotedTokensMaskInverted
                    }); // U:[FA-38]
                }
            }
        }

        if (expectedBalances.length != 0) {
            bool success = BalancesLogic.compareBalances(creditAccount, expectedBalances);
            if (!success) revert BalanceLessThanMinimumDesiredException(); // U:[FA-23]
        }

        if ((flags & REVERT_ON_FORBIDDEN_TOKENS_AFTER_CALLS != 0) && (enabledTokensMask & forbiddenTokenMask != 0)) {
            revert ForbiddenTokensException(); // U:[FA-27]
        }

        if (flags & EXTERNAL_CONTRACT_WAS_CALLED != 0) {
            _unsetActiveCreditAccount(); // U:[FA-38]
        }

        fullCheckParams.enabledTokensMaskAfter = enabledTokensMask; // U:[FA-38]

        emit FinishMultiCall(); // U:[FA-18]
    }

    /// @dev Applies on-demand price feed updates placed at the beginning of the multicall (if there are any)
    /// @return skipCalls Number of update calls made that can be skiped later in the `_multicall`
    function _applyOnDemandPriceUpdates(MultiCall[] calldata calls) internal returns (uint256 skipCalls) {
        address priceOracle;
        unchecked {
            uint256 len = calls.length;
            for (uint256 i; i < len; ++i) {
                MultiCall calldata mcall = calls[i];
                if (
                    mcall.target == address(this)
                        && bytes4(mcall.callData) == ICreditFacadeV3Multicall.onDemandPriceUpdate.selector
                ) {
                    (address token, bytes memory data) = abi.decode(mcall.callData[4:], (address, bytes)); // U:[FA-25]

                    priceOracle = _getPriceOracle(priceOracle); // U:[FA-25]
                    address priceFeed = IPriceOracleBase(priceOracle).priceFeeds(token); // U:[FA-25]
                    if (priceFeed == address(0)) {
                        revert PriceFeedDoesNotExistException(); // U:[FA-25]
                    }

                    IUpdatablePriceFeed(priceFeed).updatePrice(data); // U:[FA-25]
                } else {
                    return i;
                }
            }
            return len;
        }
    }

    /// @dev Performs collateral check to ensure that
    ///      - account is sufficiently collateralized
    ///      - no forbidden tokens have been enabled during the multicall
    ///      - no enabled forbidden token balance has increased during the multicall
    function _fullCollateralCheck(
        address creditAccount,
        uint256 enabledTokensMaskBefore,
        FullCheckParams memory fullCheckParams,
        BalanceWithMask[] memory forbiddenBalances,
        uint256 _forbiddenTokenMask
    ) internal {
        uint256 enabledTokensMaskUpdated = ICreditManagerV3(creditManager).fullCollateralCheck(
            creditAccount,
            fullCheckParams.enabledTokensMaskAfter,
            fullCheckParams.collateralHints,
            fullCheckParams.minHealthFactor
        );

        bool success = BalancesLogic.checkForbiddenBalances({
            creditAccount: creditAccount,
            enabledTokensMaskBefore: enabledTokensMaskBefore,
            enabledTokensMaskAfter: enabledTokensMaskUpdated,
            forbiddenBalances: forbiddenBalances,
            forbiddenTokenMask: _forbiddenTokenMask
        });
        if (!success) revert ForbiddenTokensException(); // U:[FA-30]

        emit SetEnabledTokensMask(creditAccount, enabledTokensMaskUpdated);
    }

    /// @dev `ICreditFacadeV3Multicall.addCollateral` implementation
    function _addCollateral(address creditAccount, bytes calldata callData) internal returns (uint256 tokenMaskAfter) {
        (address token, uint256 amount) = abi.decode(callData, (address, uint256)); // U:[FA-26]

        tokenMaskAfter = ICreditManagerV3(creditManager).addCollateral({
            payer: msg.sender,
            creditAccount: creditAccount,
            token: token,
            amount: amount
        }); // U:[FA-26]

        emit AddCollateral(creditAccount, token, amount); // U:[FA-26]
    }

    /// @dev `ICreditFacadeV3Multicall.{increase|decrease}Debt` implementation
    function _manageDebt(
        address creditAccount,
        bytes calldata callData,
        uint256 enabledTokensMask,
        ManageDebtAction action
    ) internal returns (uint256 tokensToEnable, uint256 tokensToDisable) {
        uint256 amount = abi.decode(callData, (uint256)); // U:[FA-27,31]

        if (action == ManageDebtAction.INCREASE_DEBT) {
            _revertIfOutOfBorrowingLimit(amount); // U:[FA-28]
        }

        uint256 newDebt;
        (newDebt, tokensToEnable, tokensToDisable) =
            ICreditManagerV3(creditManager).manageDebt(creditAccount, amount, enabledTokensMask, action); // U:[FA-27,31]

        _revertIfOutOfDebtLimits(newDebt); // U:[FA-28, 32, 33, 33A]

        if (action == ManageDebtAction.INCREASE_DEBT) {
            emit IncreaseDebt({creditAccount: creditAccount, amount: amount}); // U:[FA-27]
        } else {
            emit DecreaseDebt({creditAccount: creditAccount, amount: amount}); // U:[FA-31]
        }
    }

    /// @dev `ICreditFacadeV3Multicall.updateQuota` implementation
    function _updateQuota(address creditAccount, bytes calldata callData, bool hasForbiddenTokens)
        internal
        returns (uint256 tokensToEnable, uint256 tokensToDisable)
    {
        (address token, int96 quotaChange, uint96 minQuota) = abi.decode(callData, (address, int96, uint96)); // U:[FA-34]

        // Ensures that user is not trying to increase quota for a forbidden token. This happens implicitly when user
        // has no enabled forbidden tokens because quota increase would try to enable the token, which is prohibited.
        // Thus some gas is saved in this case by not querying token's mask.
        if (hasForbiddenTokens && quotaChange > 0) {
            if (_getTokenMaskOrRevert(token) & forbiddenTokenMask != 0) {
                revert ForbiddenTokensException();
            }
        }

        (tokensToEnable, tokensToDisable) = ICreditManagerV3(creditManager).updateQuota({
            creditAccount: creditAccount,
            token: token,
            quotaChange: quotaChange,
            minQuota: minQuota,
            maxQuota: uint96(Math.min(type(uint96).max, maxQuotaMultiplier * debtLimits.maxDebt))
        }); // U:[FA-34]
    }

    /// @dev `ICreditFacadeV3Multicall.scheduleWithdrawal` implementation
    function _scheduleWithdrawal(address creditAccount, bytes calldata callData)
        internal
        returns (uint256 tokensToDisable)
    {
        (address token, uint256 amount) = abi.decode(callData, (address, uint256)); // U:[FA-35]

        tokensToDisable = ICreditManagerV3(creditManager).scheduleWithdrawal(creditAccount, token, amount); // U:[FA-35]
    }

    /// @dev `ICreditFacadeV3Multicall.revokeAdapterAllowances` implementation
    function _revokeAdapterAllowances(address creditAccount, bytes calldata callData) internal {
        RevocationPair[] memory revocations = abi.decode(callData, (RevocationPair[])); // U:[FA-36]

        ICreditManagerV3(creditManager).revokeAdapterAllowances(creditAccount, revocations); // U:[FA-36]
    }

    /// @dev `ICreditFacadeV3Multicall.payBot` implementation
    function _payBot(address creditAccount, bytes calldata callData) internal {
        uint72 paymentAmount = abi.decode(callData, (uint72));
        address payer = _getBorrowerOrRevert(creditAccount); // U:[FA-37]

        IBotListV3(botList).payBot({
            payer: payer,
            creditManager: creditManager,
            creditAccount: creditAccount,
            bot: msg.sender,
            paymentAmount: paymentAmount
        }); // U:[FA-37]
    }

    // ------------- //
    // CONFIGURATION //
    // ------------- //

    /// @notice Sets the credit facade expiration timestamp
    /// @param newExpirationDate New expiration timestamp
    /// @dev Reverts if credit facade is not expirable
    function setExpirationDate(uint40 newExpirationDate)
        external
        override
        creditConfiguratorOnly // U:[FA-6]
    {
        if (!expirable) {
            revert NotAllowedWhenNotExpirableException(); // U:[FA-48]
        }
        expirationDate = newExpirationDate; // U:[FA-48]
    }

    /// @notice Sets debt limits per credit account
    /// @param newMinDebt New minimum debt amount per credit account
    /// @param newMaxDebt New maximum debt amount per credit account
    /// @param newMaxDebtPerBlockMultiplier New max debt per block multiplier, `type(uint8).max` to disable the check
    function setDebtLimits(uint128 newMinDebt, uint128 newMaxDebt, uint8 newMaxDebtPerBlockMultiplier)
        external
        override
        creditConfiguratorOnly // U:[FA-6]
    {
        if ((uint256(newMaxDebtPerBlockMultiplier) * newMaxDebt) >= type(uint128).max) {
            revert IncorrectParameterException(); // U:[FA-49]
        }

        debtLimits.minDebt = newMinDebt; // U:[FA-49]
        debtLimits.maxDebt = newMaxDebt; // U:[FA-49]
        maxDebtPerBlockMultiplier = newMaxDebtPerBlockMultiplier; // U:[FA-49]
    }

    /// @notice Sets the new bot list
    /// @param newBotList New bot list address
    function setBotList(address newBotList)
        external
        override
        creditConfiguratorOnly // U:[FA-6]
    {
        botList = newBotList; // U:[FA-50]
    }

    /// @notice Sets the new max cumulative loss
    /// @param newMaxCumulativeLoss New max cumulative loss
    /// @param resetCumulativeLoss Whether to reset the current cumulative loss to zero
    function setCumulativeLossParams(uint128 newMaxCumulativeLoss, bool resetCumulativeLoss)
        external
        override
        creditConfiguratorOnly // U:[FA-6]
    {
        lossParams.maxCumulativeLoss = newMaxCumulativeLoss; // U:[FA-51]
        if (resetCumulativeLoss) {
            lossParams.currentCumulativeLoss = 0; // U:[FA-51]
        }
    }

    /// @notice Changes token's forbidden status
    /// @param token Token to change the status for
    /// @param allowance Status to set
    function setTokenAllowance(address token, AllowanceAction allowance)
        external
        override
        creditConfiguratorOnly // U:[FA-6]
    {
        uint256 tokenMask = _getTokenMaskOrRevert(token); // U:[FA-52]

        forbiddenTokenMask = (allowance == AllowanceAction.ALLOW)
            ? forbiddenTokenMask.disable(tokenMask)
            : forbiddenTokenMask.enable(tokenMask); // U:[FA-52]
    }

    /// @notice Changes account's status as emergency liquidator
    /// @param liquidator Account to change the status for
    /// @param allowance Status to set
    function setEmergencyLiquidator(address liquidator, AllowanceAction allowance)
        external
        override
        creditConfiguratorOnly // U:[FA-6]
    {
        canLiquidateWhilePaused[liquidator] = allowance == AllowanceAction.ALLOW; // U:[FA-53]
    }

    // --------- //
    // INTERNALS //
    // --------- //

    /// @dev Ensures that amount borrowed by credit manager in the current block does not exceed the limit
    /// @dev Skipped when `maxDebtPerBlockMultiplier == type(uint8).max`
    function _revertIfOutOfBorrowingLimit(uint256 amount) internal {
        uint8 _maxDebtPerBlockMultiplier = maxDebtPerBlockMultiplier; // U:[FA-43]
        if (_maxDebtPerBlockMultiplier == type(uint8).max) return; // U:[FA-43]

        uint256 newDebtInCurrentBlock;
        if (lastBlockBorrowed == block.number) {
            newDebtInCurrentBlock = amount + totalBorrowedInBlock; // U:[FA-43]
        } else {
            newDebtInCurrentBlock = amount;
            lastBlockBorrowed = uint64(block.number); // U:[FA-43]
        }

        if (newDebtInCurrentBlock > uint256(_maxDebtPerBlockMultiplier) * debtLimits.maxDebt) {
            revert BorrowedBlockLimitException(); // U:[FA-43]
        }

        // the conversion is safe because of the check in `setDebtLimits`
        totalBorrowedInBlock = uint128(newDebtInCurrentBlock); // U:[FA-43]
    }

    /// @dev Ensures that account's debt principal is within allowed range or is zero
    function _revertIfOutOfDebtLimits(uint256 debt) internal view {
        uint256 minDebt;
        uint256 maxDebt;

        // minDebt = debtLimits.minDebt;
        // maxDebt = debtLimits.maxDebt;
        assembly {
            let data := sload(debtLimits.slot)
            maxDebt := shr(128, data)
            minDebt := and(data, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)
        }

        if (debt != 0 && ((debt < minDebt) || (debt > maxDebt))) {
            revert BorrowAmountOutOfLimitsException(); // U:[FA-44]
        }
    }

    /// @dev Ensures that `flags` has the `permission` bit enabled
    function _revertIfNoPermission(uint256 flags, uint256 permission) internal pure {
        if (flags & permission == 0) {
            revert NoPermissionException(permission); // U:[FA-39]
        }
    }

    /// @dev Returns inverted quoted tokens mask, avoids external call if it has already been queried
    function _getInvertedQuotedTokensMask(uint256 currentMask) internal view returns (uint256) {
        // since underlying token can't be quoted, we can use `currentMask == 0` as an indicator
        // that mask hasn't been queried yet
        return currentMask == 0 ? ~ICreditManagerV3(creditManager).quotedTokensMask() : currentMask;
    }

    /// @dev Returns price oracle address, avoids external call if it has already been queried
    function _getPriceOracle(address priceOracle) internal view returns (address) {
        return priceOracle == address(0) ? ICreditManagerV3(creditManager).priceOracle() : priceOracle;
    }

    /// @dev Wraps any ETH sent in the function call and sends it back to `msg.sender`
    function _wrapETH() internal {
        if (msg.value != 0) {
            IWETH(weth).deposit{value: msg.value}(); // U:[FA-7]
            IERC20(weth).safeTransfer(msg.sender, msg.value); // U:[FA-7]
        }
    }

    /// @dev Claims ETH from withdrawal manager, expecting that WETH was deposited there earlier in the transaction
    function _wethWithdrawTo(address to) internal {
        IWithdrawalManagerV3(withdrawalManager).claimImmediateWithdrawal({token: ETH_ADDRESS, to: to});
    }

    /// @dev Whether credit facade has expired (always `false` if it's not expirable)
    function _isExpired() internal view returns (bool) {
        return expirable && block.timestamp >= expirationDate; // U:[FA-46]
    }

    /// @dev Internal wrapper for `creditManager.getBorrowerOrRevert` call to reduce contract size
    function _getBorrowerOrRevert(address creditAccount) internal view returns (address) {
        return ICreditManagerV3(creditManager).getBorrowerOrRevert({creditAccount: creditAccount});
    }

    /// @dev Internal wrapper for `creditManager.getTokenMaskOrRevert` call to reduce contract size
    function _getTokenMaskOrRevert(address token) internal view returns (uint256) {
        return ICreditManagerV3(creditManager).getTokenMaskOrRevert(token);
    }

    /// @dev Internal wrapper for `creditManager.getTokenByMask` call to reduce contract size
    function _getTokenByMask(uint256 mask) internal view returns (address) {
        return ICreditManagerV3(creditManager).getTokenByMask(mask);
    }

    /// @dev Internal wrapper for `creditManager.flagsOf` call to reduce contract size
    function _flagsOf(address creditAccount) internal view returns (uint16) {
        return ICreditManagerV3(creditManager).flagsOf(creditAccount);
    }

    /// @dev Internal wrapper for `creditManager.setFlagFor` call to reduce contract size
    function _setFlagFor(address creditAccount, uint16 flag, bool value) internal {
        ICreditManagerV3(creditManager).setFlagFor(creditAccount, flag, value);
    }

    /// @dev Internal wrapper for `creditManager.setActiveCreditAccount` call to reduce contract size
    function _setActiveCreditAccount(address creditAccount) internal {
        ICreditManagerV3(creditManager).setActiveCreditAccount(creditAccount); // U:[FA-26]
    }

    /// @dev Same as above but unsets active credit account
    function _unsetActiveCreditAccount() internal {
        _setActiveCreditAccount(INACTIVE_CREDIT_ACCOUNT_ADDRESS); // U:[FA-26]
    }

    /// @dev Internal wrapper for `creditManager.closeCreditAccount` call to reduce contract size
    function _closeCreditAccount(
        address creditAccount,
        ClosureAction closureAction,
        CollateralDebtData memory collateralDebtData,
        address payer,
        address to,
        uint256 skipTokensMask,
        bool convertToETH
    ) internal returns (uint256 remainingFunds, uint256 reportedLoss) {
        (remainingFunds, reportedLoss) = ICreditManagerV3(creditManager).closeCreditAccount({
            creditAccount: creditAccount,
            closureAction: closureAction,
            collateralDebtData: collateralDebtData,
            payer: payer,
            to: to,
            skipTokensMask: skipTokensMask,
            convertToETH: convertToETH
        }); // U:[FA-15,49]
    }

    /// @dev Internal wrapper for `creditManager.calcDebtAndCollateral` call to reduce contract size
    function _calcDebtAndCollateral(address creditAccount, CollateralCalcTask task)
        internal
        view
        returns (CollateralDebtData memory)
    {
        return ICreditManagerV3(creditManager).calcDebtAndCollateral(creditAccount, task);
    }

    /// @dev Internal wrapper for `creditManager.claimWithdrawals` call to reduce contract size
    function _claimWithdrawals(address creditAccount, address to, ClaimAction action)
        internal
        returns (uint256 tokensToEnable)
    {
        tokensToEnable = ICreditManagerV3(creditManager).claimWithdrawals(creditAccount, to, action); // U:[FA-16,37]
    }

    /// @dev Internal wrapper for `botList.eraseAllBotPermissions` call to reduce contract size
    function _eraseAllBotPermissions(address creditAccount) internal {
        uint16 flags = _flagsOf(creditAccount); // U:[FA-42]
        if (flags & BOT_PERMISSIONS_SET_FLAG != 0) {
            IBotListV3(botList).eraseAllBotPermissions(creditManager, creditAccount); // U:[FA-42]
        }
    }

    /// @dev Reverts if `msg.sender` is not credit configurator
    function _checkCreditConfigurator() internal view {
        if (msg.sender != ICreditManagerV3(creditManager).creditConfigurator()) {
            revert CallerNotConfiguratorException();
        }
    }

    /// @dev Reverts if `msg.sender` is not `creditAccount` owner
    function _checkCreditAccountOwner(address creditAccount) internal view {
        if (msg.sender != _getBorrowerOrRevert(creditAccount)) {
            revert CallerNotCreditAccountOwnerException();
        }
    }

    /// @dev Reverts if credit facade is expired
    function _checkExpired() internal view {
        if (_isExpired()) {
            revert NotAllowedAfterExpirationException(); // U:[FA-46]
        }
    }
}
