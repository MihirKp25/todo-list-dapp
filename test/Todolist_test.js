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
})