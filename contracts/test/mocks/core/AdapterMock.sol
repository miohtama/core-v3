// SPDX-License-Identifier: UNLICENSED
// Gearbox Protocol. Generalized leverage for DeFi protocols
// (c) Gearbox Holdings, 2023
pragma solidity ^0.8.17;

import {AbstractAdapter} from "../../../core/AbstractAdapter.sol";

/// @title Adapter Mock
contract AdapterMock is AbstractAdapter {
    /// @notice Constructor
    /// @param _creditManager Credit manager address
    /// @param _targetContract Target contract address
    constructor(address _creditManager, address _targetContract) AbstractAdapter(_creditManager, _targetContract) {}

    function creditAccount() external view returns (address) {
        return _creditAccount();
    }

    function getMaskOrRevert(address token) external view returns (uint256 tokenMask) {
        return _getMaskOrRevert(token);
    }

    function approveToken(address token, uint256 amount) external {
        _approveToken(token, amount);
    }

    function execute(bytes memory callData) external returns (bytes memory result) {
        result = _execute(callData);
    }

    function executeSwapNoApprove(address tokenIn, address tokenOut, bytes memory callData, bool disableTokenIn)
        external
        returns (uint256 tokensToEnable, uint256 tokensToDisable, bytes memory result)
    {
        return _executeSwapNoApprove(tokenIn, tokenOut, callData, disableTokenIn);
    }

    function executeSwapSafeApprove(address tokenIn, address tokenOut, bytes memory callData, bool disableTokenIn)
        external
        returns (uint256 tokensToEnable, uint256 tokensToDisable, bytes memory result)
    {
        return _executeSwapSafeApprove(tokenIn, tokenOut, callData, disableTokenIn);
    }

    function dumbCall(uint256 _tokensToEnable, uint256 _tokensToDisable)
        external
        creditFacadeOnly
        returns (uint256 tokensToEnable, uint256 tokensToDisable)
    {
        _execute(dumbCallData());
        tokensToEnable = _tokensToEnable;
        tokensToDisable = _tokensToDisable;
    }

    function dumbCallData() public pure returns (bytes memory) {
        return abi.encodeWithSignature("hello(string)", "world");
    }

    fallback() external creditFacadeOnly {
        _execute(msg.data);
    }
}
