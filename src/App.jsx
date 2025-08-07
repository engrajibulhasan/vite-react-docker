import React, { useState, useEffect } from 'react';

function App() {
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched todo:', data);
        setTodo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching todo:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, []);

  const refreshTodo = () => {
    setTodo(null);
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      const fetchTodo = async () => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL;
          const response = await fetch(apiUrl);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('Refreshed todo:', data);
          setTodo(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          console.error('Error fetching todo:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchTodo();
    }, 500);
  };

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1>Todo Fetcher</h1>
          <p>Simple React app with API integration</p>
        </div>

        <div className="card">
          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <span>Loading todo...</span>
            </div>
          )}

          {error && (
            <div className="error">
              <div>
                <p><strong>Error occurred</strong></p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {todo && !loading && !error && (
            <div className="todo-details">
              <div className="todo-header">
                <h2>Todo Details</h2>
                <div className={`status-icon ${todo.completed ? 'completed' : 'pending'}`}>
                  {todo.completed ? '✓' : '○'}
                </div>
              </div>

              <div className="todo-content">
                <div className="field">
                  <label>Title</label>
                  <p className="title">{todo.title}</p>
                </div>

                <div className="field-row">
                  <div className="field">
                    <label>ID</label>
                    <p>#{todo.id}</p>
                  </div>
                  <div className="field">
                    <label>User ID</label>
                    <p>#{todo.userId}</p>
                  </div>
                </div>

                <div className="field">
                  <label>Status</label>
                  <div className="status-badge">
                    <span className={`badge ${todo.completed ? 'completed' : 'pending'}`}>
                      {todo.completed ? '✓ Completed' : '○ Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="actions">
            <button
              onClick={refreshTodo}
              disabled={loading}
              className="refresh-btn"
            >
              {loading ? 'Refreshing...' : 'Refresh Todo'}
            </button>
          </div>
        </div>

        <div className="api-info">
          API Endpoint: {import.meta.env.VITE_API_URL}
        </div>
      </div>
    </div>
  );
}

export default App;