import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'


const blogUser = {
  username: 'testuser',
  token: 'token',
  id: '007'
}

const blog = {
  title: 'this is a test blog',
  author: 'someone great',
  likes: 5,
  url: 'testurl',
  user: blogUser
}

const mockHandleClick = jest.fn()
const mockLike = jest.fn()

const user = userEvent.setup()


test('renders title', () => {
  render(
    <Blog user={blogUser} blog={blog} handleClick={mockHandleClick} like={mockLike} />
  )

  screen.getByText('this is a test blog')
})

test('url, likes an author shown when handler clicked', async () => {
  render(
    <Blog user={blogUser} blog={blog} handleClick={mockHandleClick} like={mockLike} />
  )

  const button = screen.getByText('show')

  await user.click(button)

  const author = screen.getByText('someone great')
  const url = screen.getByText('testurl')
  const likes = document.querySelector('#likes')

  expect(author).toBeDefined()
  expect(url).toBeDefined()
  expect(likes).toBeDefined()
})

test('like button works multiple times', async () => {
  render(
    <Blog user={blogUser} blog={blog} handleClick={mockHandleClick} like={mockLike} />
  )

  const button = screen.getByText('like')

  await user.click(button)
  await user.click(button)

  expect(mockLike.mock.calls).toHaveLength(2)
})

test('BlogForm updates parent state and calls submit function', async () => {
  const createBlog = jest.fn()

  render(<BlogForm createBlog={createBlog} />)

  const authorInput = document.getElementById('authorInput')
  const titleInput = document.getElementById('titleInput')
  const urlInput = document.getElementById('urlInput')

  const sendBtn = document.getElementById('create-blog')

  /*expect(sendBtn).toBeDefined()
  expect(authorInput).toBeDefined()
  expect(titleInput).toBeDefined()
  expect(urlInput).toBeDefined()*/

  await user.type(authorInput, 'test author')
  await user.type(titleInput, 'test title')
  await user.type(urlInput, 'test url')

  await user.click(sendBtn)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('test title')
  expect(createBlog.mock.calls[0][0].author).toBe('test author')
  expect(createBlog.mock.calls[0][0].url).toBe('test url')
})