//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

contract UBI {
    event Subscribed(address subscriber);
    event Unsubscribed(address subscriber);

    address private owner;
    address private backend;

    mapping(address => bool) private subscribersMap;
    address[] private subscribers;

    uint256 private monthlyIncome = 0.001 ether;

    constructor(address _backend) {
        owner = msg.sender;
        backend = _backend;
    }

    function getMonthlyIncome() public view returns (uint256) {
        return monthlyIncome;
    }

    function setMonthlyIncome(uint256 _monthlyIncome) public onlyOwner {
        monthlyIncome = _monthlyIncome;
    }

    function getBackend() public view onlyOwner returns (address) {
        return backend;
    }

    function setBackend(address _backend) public onlyOwner {
        backend = _backend;
    }

    function subscribe() public {
        require(msg.sender != backend, "The backend can't subscribe.");

        addSubscription(msg.sender);
        emit Subscribed(msg.sender);
    }

    function unsubscribe() public {
        cancelSubscription(msg.sender);
        emit Unsubscribed(msg.sender);
    }

    function addCrossChainSubscription(address subscriber) public onlyBackend {
        addSubscription(subscriber);
    }

    function cancelCrossChainSubscription(address subscriber) public onlyBackend {
        cancelSubscription(subscriber);
    }

    function donate() public payable {}

    function distribute() public onlyBackend {
        // TODO don't allow too frequent distribution

        require(address(this).balance > monthlyIncome * subscribers.length, "Not enough funds for distribution.");
        for (uint256 i = 0; i < subscribers.length; i++) {
            (bool success, ) = subscribers[i].call{value: monthlyIncome}("");
            require(success, "Distribution failed.");
        }
    }

    function addSubscription(address subscriber) private {
        require(!subscribersMap[subscriber], "Address is already subscribed.");

        subscribersMap[subscriber] = true;
        subscribers.push(subscriber);
    }

    function cancelSubscription(address subscriber) private {
        require(subscribersMap[subscriber], "Address isn't subscribed.");

        for (uint i = 0; i < subscribers.length; i++) {
            if (subscribers[i] == subscriber) {
                subscribers[i] = subscribers[subscribers.length - 1];
                break;
            }
        }

        subscribers.pop();
        subscribersMap[subscriber] = false;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Operation allowed only for owner.");
        _;
    }

    modifier onlyBackend() {
        require(msg.sender == backend, "Operation allowed only for backend.");
        _;
    }

    fallback() external {
        require(false, "Please use the 'donate' function.");
    }
}