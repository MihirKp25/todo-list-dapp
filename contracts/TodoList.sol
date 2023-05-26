pragma solidity ^0.5.0;

contract TodoList {
    uint public taskcnt=0;


    struct Task {
        uint id;
        string content;
        bool completed;
    }

    event TaskCreated(
        uint id,
        string content,
        bool completed
    );

    constructor() public
    {
        createTask("this is my task");
    }

    mapping(uint => Task) public taskList;

    function createTask(string memory _content) public
    {
        taskcnt++;
        taskList[taskcnt]=Task(taskcnt, _content, false);
        emit TaskCreated(taskcnt, _content, false);
    }
}