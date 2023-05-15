// SPDX-License-Identifier: UNLICENSED
// Gearbox Protocol. Generalized leverage for DeFi protocols
// (c) Gearbox Holdings, 2022
pragma solidity ^0.8.10;

/// MOCKS
import {AddressProviderV3ACLMock} from "../../mocks/core/AddressProviderV3ACLMock.sol";
import {AccountFactoryMock} from "../../mocks/core/AccountFactoryMock.sol";
import {ACL} from "@gearbox-protocol/core-v2/contracts/core/ACL.sol";

import {AccountFactory} from "@gearbox-protocol/core-v2/contracts/core/AccountFactory.sol";
import {CreditManagerV3Harness} from "./CreditManagerV3Harness.sol";

/// INTERFASE
import "../../../interfaces/IAddressProviderV3.sol";
import {ICreditAccount} from "@gearbox-protocol/core-v2/contracts/interfaces/ICreditAccount.sol";
import {
    ICreditManagerV3,
    ICreditManagerV3Events,
    ClosureAction,
    CollateralTokenData,
    CollateralDebtData,
    ManageDebtAction
} from "../../../interfaces/ICreditManagerV3.sol";
import {IWETH} from "@gearbox-protocol/core-v2/contracts/interfaces/external/IWETH.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IPriceOracleV2, IPriceOracleV2Ext} from "@gearbox-protocol/core-v2/contracts/interfaces/IPriceOracle.sol";
import {IWETHGateway} from "../../../interfaces/IWETHGateway.sol";
import {IWithdrawalManager} from "../../../interfaces/IWithdrawalManager.sol";

import {IPoolService} from "@gearbox-protocol/core-v2/contracts/interfaces/IPoolService.sol";

import {PERCENTAGE_FACTOR} from "@gearbox-protocol/core-v2/contracts/libraries/PercentageMath.sol";

// LIBS & TRAITS
import {BitMask} from "../../../libraries/BitMask.sol";
// TESTS

import "../../lib/constants.sol";
import {BalanceHelper} from "../../helpers/BalanceHelper.sol";

// EXCEPTIONS
import "../../../interfaces/IExceptions.sol";

// MOCKS
import {PriceOracleMock} from "../../mocks/oracles/PriceOracleMock.sol";
import {PoolMock} from "../../mocks/pool/PoolMock.sol";

// SUITES
import {TokensTestSuite} from "../../suites/TokensTestSuite.sol";
import {Tokens} from "../../config/Tokens.sol";

import {CreditConfig} from "../../config/CreditConfig.sol";

// EXCEPTIONS
import "../../../interfaces/IExceptions.sol";

import {Test} from "forge-std/Test.sol";
import "forge-std/console.sol";

/// @title AddressRepository
/// @notice Stores addresses of deployed contracts
contract CreditManagerV3UnitTest is Test, ICreditManagerV3Events, BalanceHelper {
    using BitMask for uint256;

    IAddressProviderV3 addressProvider;
    IWETH wethToken;

    AccountFactoryMock af;
    CreditManagerV3Harness creditManager;
    PoolMock poolMock;
    IPriceOracleV2 priceOracle;
    IWETHGateway wethGateway;
    IWithdrawalManager withdrawalManager;

    address underlying;

    CreditConfig creditConfig;

    function setUp() public {
        tokenTestSuite = new TokensTestSuite();

        tokenTestSuite.topUpWETH{value: 100 * WAD}();

        underlying = tokenTestSuite.addressOf(Tokens.DAI);

        addressProvider = new AddressProviderV3ACLMock();

        addressProvider.setAddress(AP_WETH_TOKEN, tokenTestSuite.addressOf(Tokens.WETH), false);

        poolMock = new PoolMock(address(addressProvider), underlying);
        creditManager = new CreditManagerV3Harness(address(addressProvider), address(poolMock));

        creditManager.setCreditFacade(address(this));
    }

    ///
    /// HELPERS

    ///
    ///
    ///  TESTS
    ///
    ///
    /// @dev U:[CM-1]: credit manager reverts if were called non-creditFacade
    function test_U_CM_01_constructor_sets_correct_values() public {
        // creditManager = new CreditManagerV3Harness(address(poolMock),);

        assertEq(address(creditManager.poolService()), address(poolMock), "Incorrect poolSerivice");

        assertEq(address(creditManager.pool()), address(poolMock), "Incorrect pool");

        assertEq(creditManager.underlying(), tokenTestSuite.addressOf(Tokens.DAI), "Incorrect underlying");

        (address token, uint16 lt) = creditManager.collateralTokens(0);

        assertEq(token, tokenTestSuite.addressOf(Tokens.DAI), "Incorrect underlying");

        assertEq(
            creditManager.getTokenMaskOrRevert(tokenTestSuite.addressOf(Tokens.DAI)),
            1,
            "Incorrect token mask for underlying token"
        );

        assertEq(lt, 0, "Incorrect LT for underlying");

        assertEq(creditManager.weth(), addressProvider.getAddressOrRevert(AP_WETH_TOKEN, 0), "Incorrect WETH token");

        assertEq(
            address(creditManager.wethGateway()),
            addressProvider.getAddressOrRevert(AP_WETH_GATEWAY, 3_00),
            "Incorrect WETH Gateway"
        );

        assertEq(
            address(creditManager.priceOracle()),
            addressProvider.getAddressOrRevert(AP_PRICE_ORACLE, 2),
            "Incorrect Price oracle"
        );

        assertEq(address(creditManager.creditConfigurator()), address(this), "Incorrect creditConfigurator");
    }

    /// @dev U:[CM-2]:credit account management functions revert if were called non-creditFacade
    /// Functions list:
    /// - openCreditAccount
    /// - closeCreditAccount
    /// - manadgeDebt
    /// - addCollateral
    /// - transferOwnership
    /// All these functions have creditFacadeOnly modifier
    function test_U_CM_02_credit_account_management_functions_revert_if_not_called_by_creditFacadeCall() public {
        assertEq(creditManager.creditFacade(), address(this));

        vm.startPrank(USER);

        vm.expectRevert(CallerNotCreditFacadeException.selector);
        creditManager.openCreditAccount(200000, address(this), false);

        CollateralDebtData memory collateralDebtData;

        vm.expectRevert(CallerNotCreditFacadeException.selector);
        creditManager.closeCreditAccount({
            creditAccount: DUMB_ADDRESS,
            closureAction: ClosureAction.LIQUIDATE_ACCOUNT,
            collateralDebtData: collateralDebtData,
            payer: DUMB_ADDRESS,
            to: DUMB_ADDRESS,
            skipTokensMask: 0,
            convertToETH: false
        });

        vm.expectRevert(CallerNotCreditFacadeException.selector);
        creditManager.manageDebt(DUMB_ADDRESS, 100, 0, ManageDebtAction.INCREASE_DEBT);

        vm.expectRevert(CallerNotCreditFacadeException.selector);
        creditManager.addCollateral(DUMB_ADDRESS, DUMB_ADDRESS, DUMB_ADDRESS, 100);

        vm.expectRevert(CallerNotCreditFacadeException.selector);
        creditManager.transferAccountOwnership(DUMB_ADDRESS, DUMB_ADDRESS);

        vm.stopPrank();
    }

    /// @dev U:[CM-3]:credit account execution functions revert if were called non-creditFacade & non-adapters
    /// Functions list:
    /// - approveCreditAccount
    /// - executeOrder
    /// - checkAndEnableToken
    /// - fullCollateralCheck
    /// - disableToken
    /// - changeEnabledTokens
    function test_U_CM_03_credit_account_execution_functions_revert_if_not_called_by_creditFacade_or_adapters()
        public
    {
        assertEq(creditManager.creditFacade(), address(this));

        vm.startPrank(USER);

        vm.expectRevert(CallerNotAdapterException.selector);
        creditManager.approveCreditAccount(DUMB_ADDRESS, 100);

        vm.expectRevert(CallerNotAdapterException.selector);
        creditManager.executeOrder(bytes("0"));

        vm.expectRevert(CallerNotCreditFacadeException.selector);
        creditManager.fullCollateralCheck(DUMB_ADDRESS, 0, new uint256[](0), 10000);

        vm.stopPrank();
    }

    /// @dev U:[CM-4]:credit account configuration functions revert if were called non-configurator
    /// Functions list:
    /// - addToken
    /// - setFees
    /// - setLiquidationThreshold
    /// - setForbidMask
    /// - setContractAllowance
    /// - upgradeContracts
    /// - setCreditConfigurator
    /// - addEmergencyLiquidator
    /// - removeEmergenceLiquidator
    function test_U_CM_04_credit_account_configurator_functions_revert_if_not_called_by_creditConfigurator() public {
        assertEq(creditManager.creditFacade(), address(this));

        vm.startPrank(USER);

        vm.expectRevert(CallerNotConfiguratorException.selector);
        creditManager.addToken(DUMB_ADDRESS);

        vm.expectRevert(CallerNotConfiguratorException.selector);
        creditManager.setFees(0, 0, 0, 0, 0);

        vm.expectRevert(CallerNotConfiguratorException.selector);
        creditManager.setCollateralTokenData(DUMB_ADDRESS, 0, 0, 0, 0);

        vm.expectRevert(CallerNotConfiguratorException.selector);
        creditManager.setContractAllowance(DUMB_ADDRESS, DUMB_ADDRESS);

        vm.expectRevert(CallerNotConfiguratorException.selector);
        creditManager.setCreditFacade(DUMB_ADDRESS);

        vm.expectRevert(CallerNotConfiguratorException.selector);
        creditManager.setPriceOracle(DUMB_ADDRESS);

        vm.expectRevert(CallerNotConfiguratorException.selector);
        creditManager.setCreditConfigurator(DUMB_ADDRESS);

        vm.expectRevert(CallerNotConfiguratorException.selector);
        creditManager.setMaxEnabledTokens(255);

        vm.stopPrank();
    }
}
