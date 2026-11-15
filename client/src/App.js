import React, {useEffect, useState} from 'react'
import Header from './Header.jsx'

function App() {
  const [backendData, setBackendData] = useState([{}])

  useEffect(() => {
    fetch("/api/listings").then(
      response => response.json()
    ).then(
        data => setBackendData(data)
    )
  }, [])

  return (
    <div>
      <Header
        showSearchBar={true}
        user={{firstName: "John", lastName: "Doe"}}
      />
      <p>hello world</p>
      <p>{JSON.stringify(backendData)}</p>
    </div>
  );
}

export default App;
