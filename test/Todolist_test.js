const { assert } = require("chai")

const TodoList = artifacts.require('./TodoList.sol')

contract('TodoList', (accounts)=>{
    before(async()=>{
        this.todolist=await TodoList.deployed()
    })

    it('deploys successfully', async () => {
        const address = await this.todolist.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
      })

      it('lists tasks', async () => {
        const taskCount = await this.todolist.taskcnt()
        const task = await this.todolist.taskList(taskCount)
        assert.equal(task.id.toNumber(), taskCount.toNumber())
        assert.equal(task.content, 'this is my task')
        assert.equal(task.completed, false)
        assert.equal(taskCount.toNumber(), 1)
      })

      it('creates tasks', async()=>{
        const result=await this.todolist.createTask('a new task')
        const taskcnt=await this.todolist.taskcnt()
        assert.equal(taskcnt, 2);
        console.log(result);
        const event=result.logs[0].args
        assert.equal(event.id.toNumber(), 2)
        assert.equal(event.content, 'a new task')
        assert.equal(event.completed, false)
      })
})