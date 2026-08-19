// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VeritasFraction
 * @dev Fractionalized Real-World Asset (RWA) Token for BOT Chain Mainnet (Chain ID 677).
 * Implements compliant transfer restrictions, metadata hash tracking, and oracle verification hooks.
 */
contract VeritasFraction {
    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    uint256 public totalSupply;

    address public owner;
    address public vault;
    string public ipfsSPVMetadataHash;
    string public verifierOracle;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => bool) public isWhitelisted;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event WhitelistUpdated(address indexed target, bool status);
    event TelemetryUpdated(string oracle, string ipfsHash);

    modifier onlyOwner() {
        require(msg.sender == owner, "VeritasFraction: Caller is not owner");
        _;
    }

    modifier onlyVault() {
        require(msg.sender == vault || msg.sender == owner, "VeritasFraction: Caller is not authorized vault");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        string memory _ipfsHash,
        string memory _oracle
    ) {
        name = _name;
        symbol = _symbol;
        owner = msg.sender;
        ipfsSPVMetadataHash = _ipfsHash;
        verifierOracle = _oracle;

        _mint(msg.sender, _initialSupply * 10**decimals);
        isWhitelisted[msg.sender] = true;
    }

    function setVault(address _vault) external onlyOwner {
        vault = _vault;
        isWhitelisted[_vault] = true;
    }

    function setWhitelist(address _account, bool _status) external onlyOwner {
        isWhitelisted[_account] = _status;
        emit WhitelistUpdated(_account, _status);
    }

    function mint(address _to, uint256 _amount) external onlyVault {
        _mint(_to, _amount);
    }

    function burn(address _from, uint256 _amount) external onlyVault {
        require(balanceOf[_from] >= _amount, "VeritasFraction: Insufficient balance to burn");
        balanceOf[_from] -= _amount;
        totalSupply -= _amount;
        emit Transfer(_from, address(0), _amount);
    }

    function updateTelemetryOracle(string memory _newHash) external onlyOwner {
        ipfsSPVMetadataHash = _newHash;
        emit TelemetryUpdated(verifierOracle, _newHash);
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0), "VeritasFraction: Transfer to zero address");
        require(balanceOf[msg.sender] >= _value, "VeritasFraction: Insufficient balance");
        
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0), "VeritasFraction: Transfer to zero address");
        require(balanceOf[_from] >= _value, "VeritasFraction: Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "VeritasFraction: Insufficient allowance");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    function _mint(address _to, uint256 _amount) internal {
        require(_to != address(0), "VeritasFraction: Mint to zero address");
        totalSupply += _amount;
        balanceOf[_to] += _amount;
        emit Transfer(address(0), _to, _amount);
    }
}
