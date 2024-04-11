import React, { useState, useEffect } from 'react';
import OktaAuth from '@okta/okta-auth-js';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [articles, setArticles] = useState([]);
  const [oktaAuth, setOktaAuth] = useState(null);

  useEffect(() => {
    const authClient = new OktaAuth({
      issuer: 'https://{dev-93660256.okta.com}/oauth2/default',
      clientId: '{0oagdreyfjPNgpNOV5d7}',
      redirectUri: window.location.origin + '/login/callback',
      scopes: ['openid', 'email', 'profile']
    });

    setOktaAuth(authClient);
  }, []);

  const login = async () => {
    try {
      const token = await oktaAuth.signInWithRedirect();
      setLoggedIn(true);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    try {
      await oktaAuth.signOut();
      setLoggedIn(false);
      setArticles([]);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const fetchNews = async () => {
    const apiKey = '9964863a96f949e6859ddb4485d710a2';
    const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setArticles(data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>News Application</h1>
        {!loggedIn ? (
          <button onClick={login}>Login</button>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </header>
      <main>
        {!loggedIn ? (
          <p>Please login to view news articles.</p>
        ) : (
          <div className="news-list">
            {articles.map(article => (
              <div key={article.id} className="article">
                <h2>{article.title}</h2>
                <p>{article.description}</p>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  Read more
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
