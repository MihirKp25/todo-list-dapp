App = {
  loading : false,
  contracts: {},
  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
  },
  loadWeb3: async () => {
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      window.alert("Please connect to Metamask.");
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        web3.eth.sendTransaction({
          /* ... */
        });
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider;
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({
        /* ... */
      });
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  },

  loadAccount: async () => {
    App.account = web3.eth.accounts[0];
    console.log(App.account);
  },

  loadContract: async() =>{
    const todolist= await $.getJSON('TodoList.json')
    App.contracts.TodoList = TruffleContract(todolist)
    App.contracts.TodoList.setProvider(App.web3Provider)

    //hydrate the smart contract with values from the blockchain
    App.todolist=await App.contracts.TodoList.deployed()
    console.log(todolist);
  },

  render : async ()=>{ 
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    $('#account').html(App.account)

    // Render Tasks
    await App.renderTasks()

    // Update loading state
    App.setLoading(false)
  },

  renderTasks: async ()=>{
    const taskcount=await App.todolist.taskcnt();
    console.log(taskcount);
    const $taskTemplate= $('.taskTemplate')

    for(var i=1; i<=taskcount; i++)
    {
      const task = await App.todolist.taskList(i)
      const taskId = task[0].toNumber()
      const taskContent = task[1]
      const taskCompleted = task[2]

      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.content').html(taskContent)
      $newTaskTemplate.find('input')
                      .prop('name', taskId)
                      .prop('checked', taskCompleted)
                      .on('click', App.toggleCompleted)
      if (taskCompleted) {
        $('#completedTaskList').append($newTaskTemplate)
      } else {
        $('#taskList').append($newTaskTemplate)
      }

      // Show the task
      $newTaskTemplate.show()
    }

  },

  createTask: async()=>{
    App.setLoading(true)
    const content =$('#newTask').val()
    await App.todolist.createTask(content)
    window.location.reload()
  },

  toggleCompleted: async(e)=>{
    App.setLoading(true)
    const taskid=e.target.name
    await App.todolist.toggleCompleted(taskid)
    window.location.reload()
  },
  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }

};

$(() => {
  $(window).load(() => {
    App.load();
  });
});
