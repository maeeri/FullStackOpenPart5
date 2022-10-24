import { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'
import App from '../App'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }
  const label = visible ? 'hide' : props.buttonLabel

  const toggleVisibility = () => setVisible(!visible)


  Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired
  }

  Togglable.displayName = 'my app'

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      {props.title} <button onClick={toggleVisibility}>{label}</button>
      <div style={showWhenVisible}>
        {props.children}
      </div>
    </div>
  )
})

export default Togglable