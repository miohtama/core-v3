// SPDX-License-Identifier: UNLICENSED
// Gearbox Protocol. Generalized leverage for DeFi protocols
// (c) Gearbox Foundation, 2023.
pragma solidity ^0.8.17;

import {GearboxInstance} from "./Deployer.sol";
import "../../interfaces/ICreditFacadeV3Multicall.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {ICreditFacadeV3Multicall} from "../../interfaces/ICreditFacadeV3.sol";
import {ICreditManagerV3} from "../../interfaces/ICreditManagerV3.sol";

import {MultiCall} from "../../interfaces/ICreditFacadeV3.sol";
import {MultiCallBuilder} from "../lib/MultiCallBuilder.sol";
import {MulticallGenerator} from "./MulticallGenerator.sol";

import "forge-std/Test.sol";
import "../lib/constants.sol";
import "forge-std/console.sol";
import "forge-std/Vm.sol";

// Probably I can start with one actor handler which tests user realted functionality by
// calling random numbers
// Then, it could be added liquidation layer if prices are manipulatable
// Then adapter to manipulate prices during multicall (Or simply set via priceUpdater)
// How to build a random miulticall (?)
//    - open multicall (generate random call during open CA)
//    - multicall with open CA and nonZero debt
//    - mutlicall with open CA and zeroDebt
//    - multicall during closing CA
//    - multicall during liquidation
//    - multicall for withdrawing
//
// In other words, to find a weak place, we should build possible attack vector behavior via handler and then keep all invariants there
contract Handler {
    Vm internal vm;
    GearboxInstance gi;

    MulticallGenerator mcg;

    uint256 b;
    address[] accounts;

    constructor(GearboxInstance _gi) {
        gi = _gi;
        vm = gi.getVm();
        mcg = new MulticallGenerator(address(gi.creditManager()), address(gi.adapterAttacker()));

        ICreditManagerV3 creditManager = gi.creditManager();

        uint256 cTokensQty = creditManager.collateralTokensCount();

        for (uint256 i; i < cTokensQty; ++i) {
            (address token,) = creditManager.collateralTokenByMask(1 << i);
            IERC20(token).approve(address(creditManager), type(uint256).max);
            gi.tokenTestSuite().mint(token, address(this), type(uint80).max);
        }

        b = block.timestamp;
    }

    function openCA(uint256 _debt) public {
        vm.roll(++b);

        (uint256 minDebt, uint256 maxDebt) = gi.creditFacade().debtLimits();

        uint256 debt = minDebt + (_debt % (maxDebt - minDebt));

        if (gi.pool().availableLiquidity() < 2 * debt) {
            gi.tokenTestSuite().mint(gi.underlyingT(), INITIAL_LP, 3 * debt);
            gi.tokenTestSuite().approve(gi.underlyingT(), INITIAL_LP, address(gi.pool()));

            vm.startPrank(INITIAL_LP);
            gi.pool().deposit(3 * debt, INITIAL_LP);
            vm.stopPrank();
        }

        if (gi.pool().creditManagerBorrowable(address(gi.creditManager())) > debt) {
            gi.tokenTestSuite().mint(gi.underlyingT(), address(this), debt);
            gi.tokenTestSuite().approve(gi.underlyingT(), address(this), address(gi.creditManager()));

            address creditAccount = gi.creditFacade().openCreditAccount(
                address(this),
                MultiCallBuilder.build(
                    MultiCall({
                        target: address(gi.creditFacade()),
                        callData: abi.encodeCall(ICreditFacadeV3Multicall.increaseDebt, (debt))
                    }),
                    MultiCall({
                        target: address(gi.creditFacade()),
                        callData: abi.encodeCall(ICreditFacadeV3Multicall.addCollateral, (gi.underlying(), debt))
                    })
                ),
                0
            );

            accounts.push(creditAccount);
        }
    }
}
