import { useEffect, useState } from "react";
import axios from 'axios';

function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get('/api/v1/users/register')
    .then((response) => {
      setBooks(response.data.data);
      console.log(response.data.data);
    });
  }, []);

  return (
    <>
      <div className='bg-zinc-900 min-h-screen text-white'>
        <h1>CHAT APP</h1>
        {
          books.map((book) => (
            <div key={book.id}>
              <h1>{book.title}</h1>
              <p>Genre: {book.genre}</p>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default App
