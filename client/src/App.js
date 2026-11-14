import React, {useEffect, useState} from 'react'

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
      <p>{JSON.stringify(backendData)}</p>
    </div>
  );
}

export default App;
