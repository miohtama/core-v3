// SPDX-License-Identifier: MIT
// Gearbox Protocol. Generalized leverage for DeFi protocols
// (c) Gearbox Holdings, 2022
pragma solidity ^0.8.10;

import {Balance} from "@gearbox-protocol/core-v2/contracts/libraries/Balances.sol";
import {QuotaUpdate} from "./IPoolQuotaKeeper.sol";
import {RevocationPair} from "./ICreditManagerV2.sol";

interface ICreditFacadeMulticall {
    /// @dev Instructs CreditFacadeV3 to check token balances at the end
    /// Used to control slippage after the entire sequence of operations, since tracking slippage
    /// On each operation is not ideal. Stores expected balances (computed as current balance + passed delta)
    /// and compare with actual balances at the end of a multicall, reverts
    /// if at least one is less than expected
    /// @param expected Array of expected balance changes
    /// @notice This is an extenstion function that does not exist in the Credit Facade
    ///         itself and can only be used within a multicall
    function revertIfReceivedLessThan(Balance[] memory expected) external;

    /// @dev Enables token in enabledTokenMask for the Credit Account of msg.sender
    /// @param token Address of token to enable
    function enableToken(address token) external;

    /// @dev Disables a token on the caller's Credit Account
    /// @param token Token to disable
    /// @notice This is an extenstion function that does not exist in the Credit Facade
    ///         itself and can only be used within a multicall
    function disableToken(address token) external;

    /// @dev Adds collateral to borrower's credit account
    /// @param token Address of a collateral token
    /// @param amount Amount to add
    function addCollateral(address token, uint256 amount) external payable;

    /// @dev Increases debt for msg.sender's Credit Account
    /// - Borrows the requested amount from the pool
    /// - Updates the CA's borrowAmount / cumulativeIndexOpen
    ///   to correctly compute interest going forward
    /// - Performs a full collateral check
    ///
    /// @param amount Amount to borrow
    function increaseDebt(uint256 amount) external;

    /// @dev Decrease debt
    /// - Decreases the debt by paying the requested amount + accrued interest + fees back to the pool
    /// - It's also include to this payment interest accrued at the moment and fees
    /// - Updates cunulativeIndex to cumulativeIndex now
    ///
    /// @param amount Amount to increase borrowed amount
    function decreaseDebt(uint256 amount) external;

    /// @dev Update msg.sender's Credit Account quotas for multiple tokens
    /// @param quotaUpdates Requested quota updates, see `QuotaUpdate`
    function updateQuotas(QuotaUpdate[] memory quotaUpdates) external;

    /// @dev Set collateral hints for a full check
    /// @param collateralHints Array of token mask in the desired order of checking
    /// @param minHealthFactor Minimal HF threshold to pass the collateral check in PERCENTAGE format.
    ///                        Cannot be lower than PERCENTAGE_FACTOR.
    function setFullCheckParams(uint256[] memory collateralHints, uint16 minHealthFactor) external;

    function withdraw(address token, uint256 amount) external;

    function revokeAdapterAllowances(RevocationPair[] calldata revocations) external;
}
