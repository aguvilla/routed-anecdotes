import { useState } from 'react'
import {  Link, Route, Routes, useMatch, Navigate  } from 'react-router-dom'
import { useField } from './hooks'
const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link style={padding} to={'/'}>anecdotes</Link>
      <Link style={padding} to={'/create'}>create new</Link>
      <Link style={padding} to={'/about'}>about</Link>
    </div>
  )
}

const Anecdote = ({anecdote}) => (
	<div>
		<h2>{anecdote.content}</h2>
		<h4>by {anecdote.author} has {anecdote.votes} votes</h4>
	</div>
)


const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => 
			
			<li key={anecdote.id} >
				<Link to={`anecdote/${anecdote.id}`}>
				{anecdote.content}
				</Link>
			</li>
			)
			}
    </ul>
  </div>
)

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const Input = (props) => {
	const {reset, ...others} = props.object
	return(
		<div>
		{props.text}
		<input {...others}/> 
		</div>
	)
}

const CreateNew = (props) => {
  const content = useField('content')
  const author = useField('author')
  const info = useField('info')
	const [toHome, setToHome] = useState(false)

	const handleReset = (e) => {
		e.preventDefault()
		content.reset()
		author.reset()
		info.reset()
	} 
  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
		setToHome(true)
		props.setNotification(content.value)
		setTimeout(() => props.setNotification(''), 5000)
  }
	if (toHome) {
		return <Navigate to='/'/>
	}

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form  onSubmit={handleSubmit}>
        
        <Input text={'content'} object={content}/>
        <Input text={'author'} object={author}/>
        <Input text={'info or url'} object={info}/>
        <button type='submit'>create</button>
				<button onClick={handleReset}>reset</button>
				
      </form>
    </div>
  )

}

const Notification = (props) => {
	if (props.message) {
		return (
		<p>a new notification {props.message} created </p>
	)
}
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }
	const match = useMatch('/anecdote/:id')
	const anecdote = match ? 
		anecdotes.find( a => a.id === Number(match.params.id))
		:null
  return (
    <div>
      <h1>Software anecdotes</h1>
			<Menu />
			<Notification message = {notification}/>
			<Routes>
				<Route path='/anecdote/:id' element={<Anecdote anecdote={anecdote}/>}></Route>
				<Route path='/' element={<AnecdoteList anecdotes={anecdotes} />}></Route>
				<Route path='/create' element={<CreateNew addNew={addNew} setNotification={setNotification}/>}></Route>
				<Route path='/about' element={<About/>}></Route>
			</Routes>
      <br></br>
      <Footer />
    </div>
  )
}

export default App
