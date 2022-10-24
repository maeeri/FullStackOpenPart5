import PropTypes from 'prop-types'
import Togglable from './Togglable'


const Blog = ({ blog, handleClick, like, user }) => {
  const blogStyle = {
    padding: 10,
    paddingLeft: 10,
    border: 'solid',
    borderWidth: 1,
    margin: 5,
    display: 'absolute',
  }
  Blog.displayName = 'my app'

  const hideWhenDifferentUser = { display: user.id.toString() === blog.user.id.toString() ? '' : 'none' }

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    handleClick: PropTypes.func.isRequired,
    like: PropTypes.func.isRequired
  }

  return (
    <div className='blog' style={blogStyle}>
      <Togglable className='show' title={blog.title} buttonLabel="show">
        <div>
          {blog.author}
        </div>
        <div>
          {blog.url}
        </div>
        <div id="likes">
          {blog.likes}
          <button className='like' onClick={() => like(blog.id)}>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        <button className='delete' style={hideWhenDifferentUser} onClick={() => handleClick(blog.id)}>delete</button>
      </Togglable>
    </div>
  )
}

export default Blog