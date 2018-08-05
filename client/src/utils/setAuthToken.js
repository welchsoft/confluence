import axios from 'axios'

const setAuthToken = token => {
  if(token) {
    //apply to every request
    axios.defaults.headers.common['Authorization'] = token
  } else {
    // Delete auther headers
    delete axios.defaults.headers.common['Authorization']
  }
}

export default setAuthToken
