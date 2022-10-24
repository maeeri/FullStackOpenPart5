import { useState } from 'react'


const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = async (event) => {
    event.preventDefault()
    await handleLogin(username, password)
    setPassword('')
    setUsername('')
  }

  return (
    <div>
      <h1>Log in</h1>
      <form onSubmit={login}>
        <table>
          <tbody>
            <tr>
              <td>
              username
              </td>
              <td>
                <input
                  id="username"
                  type="text" value={username}
                  name="Username"
                  onChange={({ target }) => {setUsername(target.value)}}
                />
              </td>
            </tr>
            <tr>
              <td>
              password
              </td>
              <td>
                <input
                  id="password"
                  type="password" value={password}
                  name="Password"
                  onChange={({ target }) => {setPassword(target.value)}}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button id="login-btn" type="submit">login</button>
      </form>
    </div>
  )
}

export default Login