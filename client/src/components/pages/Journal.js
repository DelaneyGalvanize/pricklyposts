import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'
import Todo from './../modules/todo'
import Heading from './../modules/heading'
import Mood from './../modules/mood'
import Textfield from './../modules/textfield'
import Blockquote from './../modules/blockquote'


class Journal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      journal_id: window.location.pathname.split('/')[2],
      entry_id: window.location.pathname.split('/')[3],
      entryArr: '',
      heading: '',
      mood: '',
      text: '',
      img: '',
      blockquote: '',
      todo:''
    }

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    let entry_id = +window.location.pathname.split('/')[3]

    fetch(`/api/entries/${entry_id}`, {
      method: 'GET'
    })
    .then(res => {
      return res.text().then(entries => {
        entries = JSON.parse(entries)

        let todoItems = entries.filter(entry => {
          return entry.m_id === 6
        })

        this.setState({
          heading: entries[0],
          mood: entries[1],
          text: entries[2],
          img: entries[3],
          blockquote: entries[4],
          todo: todoItems
        })
      })
    })
  }

  componentDidMount() {
    fetch(`/api/journals/${this.state.journal_id}`, {
      method: 'GET'
    }).then(res => {
      return res.text().then(entries => {
        let entryArr = JSON.parse(entries).map(entry => {
          return entry.id
        })
        this.setState({entryArr: entryArr})
      })
    })
    this.handleClick()
  }

  render() {
    // Handling logic of moving through entry arr to find prev and next entries
    let entry_id = +window.location.pathname.split('/')[3]

    let previous_entry = this.state.entryArr[this.state.entryArr.indexOf(entry_id) + 1]
    let next_entry = this.state.entryArr[this.state.entryArr.indexOf(entry_id) - 1]

    let prev = entry_id
    let next = entry_id

    if (previous_entry) prev = previous_entry
    if (next_entry) next = next_entry

    return (
      <div>
        <h1>Journal View (for each individual journal)</h1>
        <Heading entryModule={this.state.heading}/>
        <Mood entryModule={this.state.mood} />
        <Textfield entryModule={this.state.text} />
        <Todo entryModule={this.state.todo}/>
        <Blockquote entryModule={this.state.blockquote}/>
        <p><Link to='journals/'>Home</Link></p>
        <Button onClick={this.handleClick}><Link to={`/journal/${this.state.journal_id}/${prev}`}>Previous Entry</Link></Button>
        <Button onClick={this.handleClick}><Link to={`/journal/${this.state.journal_id}/${next}`}>Next Entry</Link></Button>

      </div>
    )
  }
}

export default Journal
