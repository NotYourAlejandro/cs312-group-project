import React, {useEffect, useState} from 'react'
import Header from './Header.jsx'

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    // fetch current user info
    fetch("/api/users/1").then(
      response => response.json()
    ).then(
      data => setUser(data)
    )
  }, [])

  return (
    <div>
      <Header
        showSearchBar={true}
        user={user}
      />
    </div>
  );
}

export default App;
