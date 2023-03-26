import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {BrowserRouter as Router} from 'react-router-dom'
import {Provider} from 'react-redux'
import {AuthContextProvider} from './store/authContext'
import store from './store/data'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
    <Provider store={store}>
    <Router>
    <App />
    </Router>
    </Provider>
    </AuthContextProvider>
  </React.StrictMode>,
)
