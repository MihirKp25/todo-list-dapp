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

    event TaskCompleted(
        uint id, 
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

    function toggleCompleted(uint _id) public
    {
        Task memory _task=taskList[_id];
        _task.completed = !_task.completed;
        taskList[_id]=_task;
        emit TaskCompleted(_id, _task.completed);
    }
}