// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./VeritasAssetVault.sol";

/**
 * @title AIAgentYieldManager
 * @dev Autonomous AI Execution Agent for VeritasRWA on BOT Chain.
 * Monitors asset telemetry (DePIN energy output, GPU compute utilization, occupancy rates),
 * dynamically adjusts reward rates on VeritasAssetVault, and logs verifiable AI execution proofs.
 */
contract AIAgentYieldManager {
    address public owner;
    address public vault;

    struct TelemetryProof {
        string assetId;
        uint256 timestamp;
        uint256 metricValue; // e.g. 985 for 98.5%
        string oracleSignature;
    }

    TelemetryProof[] public telemetryLogs;
    mapping(string => uint256) public latestMetric;

    event YieldRebalancedByAI(string indexed assetId, uint256 newRewardRate, string reason);
    event TelemetryIngested(string indexed assetId, uint256 metricValue, string signature);

    modifier onlyOwner() {
        require(msg.sender == owner, "AIAgentYieldManager: Not owner");
        _;
    }

    constructor(address _vault) {
        owner = msg.sender;
        vault = _vault;
    }

    function ingestTelemetryAndRebalance(
        string memory _assetId,
        uint256 _metricValue,
        string memory _oracleSignature,
        uint256 _calculatedRewardRate,
        string memory _aiDecisionReason
    ) external onlyOwner {
        latestMetric[_assetId] = _metricValue;
        
        telemetryLogs.push(TelemetryProof({
            assetId: _assetId,
            timestamp: block.timestamp,
            metricValue: _metricValue,
            oracleSignature: _oracleSignature
        }));

        emit TelemetryIngested(_assetId, _metricValue, _oracleSignature);

        // Update vault reward rate directly via AI agent authority
        VeritasAssetVault(payable(vault)).setRewardRate(_calculatedRewardRate);

        emit YieldRebalancedByAI(_assetId, _calculatedRewardRate, _aiDecisionReason);
    }

    function getTelemetryLogsCount() external view returns (uint256) {
        return telemetryLogs.length;
    }
}
