import React, { Component } from 'react';

import {AppHeader} from '../src/components/AppHeader/AppHeader'
import {SearchPanel} from '../src/components/SearchPanel/SearchPanel'
import {TodoList} from '../src/components/TodoList/TodoList'
import {ItemStatusFilter} from '../src/components/ItemStatusFilter/ItemStatusFilter'
import {ItemAddForm} from '../src/components/ItemAddForm/ItemAddForm'

import './index.css'

export default class App extends Component {

  maxId = 100

  state = {
    todoData: [
      this.createTodoItem('Drink Coffee'),
      this.createTodoItem('Make Awesome App'),
      this.createTodoItem('Have a lunch')
    ], 
    term: '',
    filter: '' // all active done
  }



  createTodoItem(label) {
    return {
      label,
      important: false,
      done: false,
      id: this.maxId++
    }
  }

  addItem = (text) => {
    
    const newItem = this.createTodoItem(text)
    this.setState(({todoData}) => {
      const newArr = [
        ...todoData,
        newItem
      ]
      return {
        todoData: newArr
      }
    })
  }

  deleteItem = (id) => {
    this.setState(({todoData}) => {
      const idx = todoData.findIndex((el) => el.id === id)


      const before = todoData.slice(0, idx)
      const after = todoData.slice(idx + 1)

      const newArray = [...before, ...after]

      return {
        todoData: newArray
      }

    })
  }


  toggleProperty(arr, id, propName) {
    
      const idx = arr.findIndex((el) => el.id === id)

      const oldItem = arr[idx]
      const newItem = { ...oldItem, [propName]: !oldItem[propName] }

      return [
        ...arr.slice(0, idx),
        newItem,
        ...arr.slice(idx + 1)
      ]
  }

  onToggleImportant = (id) => {
    this.setState(({todoData}) => {
      
      return {
        todoData: this.toggleProperty(todoData, id, 'important')
      }
    })
  }

  onToggleDone = (id) => {
    this.setState(({todoData}) => {
      
      return {
        todoData: this.toggleProperty(todoData, id, 'done')
      }
    })
  }

search(items, term) {
  if(term.length === 0) {
    return items
  }
  return items.filter((item) => {
    return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1
  })
}

onSearchChange = (term) => {
  this.setState({term})
}
onFilterChange = (filter) => {
  this.setState({filter})
}

filter(items, filter) {
  switch (filter) {
    case 'all': return items;
    case 'active': return items.filter(item => !item.done);
    case 'done': return items.filter(item => item.done);
    default: return items;
  }
}



  render() {
    
    const {todoData, term, filter} = this.state
    const doneCount = todoData.filter(el => el.done).length
    const todoCount = todoData.length - doneCount

    const visibleItems = this.filter(
      this.search(todoData, term), filter)
    return (
      <div className="todo-app">
        <AppHeader toDo={todoCount} done={doneCount} />
        <div className="top-panel d-flex">
          <SearchPanel onSearchChange={this.onSearchChange}/>
          <ItemStatusFilter filter={filter} onFilterChange={this.onFilterChange}/>
        </div>
  
        <TodoList todos={visibleItems} onDeleted={this.deleteItem}
        onToggleImportant={this.onToggleImportant}
        onToggleDone={this.onToggleDone}/>
        <ItemAddForm onItemAdded={this.addItem}/>
      </div>
    );
  }
}


