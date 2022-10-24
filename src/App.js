import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const [error, setError] = useState(false)

  const togglableRef = useRef()

  useEffect(() => {
    getBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const getBlogs = () => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }

  const handleLogin = async (username, password) => {
    console.log(username, password)
    try {
      //console.log('handleLogin try block')

      const returnedUser = await loginService.login({ username, password })
      setUser(returnedUser)

      //console.log(returnedUser)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(returnedUser)
      )
      blogService.setToken(returnedUser.token)
    } catch (exception) {
      console.log(exception)
      setMessage('wrong username or password')
      setError(true)
      messageTimeOut()
    }
    getBlogs()
  }

  const createBlog = (blog) => {
    togglableRef.current.toggleVisibility()
    blogService.create(blog, user.token)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        messageTimeOut()
      })
      .catch(error => {
        handleError(error.response.data.error)
        setError(false)
      })
  }

  const logout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const messageTimeOut = () => {
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleError = (msg) => {
    setError(true)
    setMessage(msg)
    messageTimeOut()
  }

  const likeBlog = async (id) => {
    const blog = await blogService.getOne(id)
    blog.likes += 1
    console.log(blog.likes)
    blogService.update(id, blog, user.token)
    getBlogs()
  }

  const removeBlog = async (id) => {
    const blog = await blogService.getOne(id)
    const sameUser = user.id.toString() === blog.user.toString()
    if (sameUser && window.confirm(`Are you sure you want to delete ${blog.title} by ${blog.author}?`)) {
      const blog = await blogService.getOne(id)
      blogService.remove(id, user.token)
        .then(returnedBlogs => {
          getBlogs()
        })
      setMessage(`${blog.title} deleted`)
      messageTimeOut()
    } else if (!sameUser) {
      window.alert('you did not add this blog, so you can\'t delete it')
    }
    getBlogs()
  }
  let i = 0
  const blogsToShow = blogs.sort((a, b) => b.likes - a.likes)
  //const blogsToShow = blogs

  return (
    <div className="content">
      <div>
        <Notification type= {error} message={message} />
      </div>
      <div className="box">
        {user === null &&
        <Login handleLogin={handleLogin} />}
      </div>
      {user !== null &&
        <div className="box">
          <div>{user.name} is now logged in</div>
          <button id="logout" onClick={logout}>log out</button>
          <h2>blogs</h2>

          {blogsToShow.map(blog =>
            <Blog user={user} key={blog.id} blog={blog} like={likeBlog} handleClick={() => removeBlog(blog.id)} />
          )}

          <Togglable buttonLabel="add a blog" ref={togglableRef}>

            <h2>create new</h2>

            <BlogForm
              createBlog={createBlog}
            />
          </Togglable>
        </div>
      }
    </div>
  )
}

export default App
