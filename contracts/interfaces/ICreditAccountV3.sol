// SPDX-License-Identifier: MIT
// Gearbox Protocol. Generalized leverage for DeFi protocols
// (c) Gearbox Foundation, 2023.
pragma solidity ^0.8.17;

import {IVersion} from "./IVersion.sol";

/// @title Credit account V3 interface
interface ICreditAccountV3 is IVersion {
    function factory() external view returns (address);

    function creditManager() external view returns (address);

    function safeTransfer(address token, address to, uint256 amount) external;

    function execute(address target, bytes calldata data) external returns (bytes memory result);

    function rescue(address target, bytes calldata data) external;
}
