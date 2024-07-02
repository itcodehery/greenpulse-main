import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./HomePage.css";

const HomePage = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [username, setUsername] = useState(""); 
  const imageRegex = /\((https?:\/\/.*?\.(?:png|jpg|jpeg|gif))\)/;
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentPosts();
    fetchUsername();
  }, []);

  const fetchRecentPosts = async () => {
    const users = ['princekham', 'niznov', 'ak08', 'tommyl33'];
    const postPromises = users.map(user => 
      fetch('https://api.hive.blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'condenser_api.get_discussions_by_blog',
          params: [{ tag: user, limit: 5 }],
          id: 1,
        }),
      })
      .then(response => response.json())
      .then(data => data.result)
      .catch(error => {
        console.error('Error fetching posts for ${user}:', error);
        return [];
      })
    );

    try {
      const postsFromAllUsers = await Promise.all(postPromises);
      const mergedPosts = postsFromAllUsers.flat();
      const sortedPosts = mergedPosts.sort((a, b) => new Date(b.created) - new Date(a.created));
      const latestPosts = sortedPosts.slice(0, 10);
      setRecentPosts(latestPosts);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
    }
  };

  const fetchUsername = () => {
    const storedUsername = localStorage.getItem('username'); 
    setUsername(storedUsername || ""); 
  };

  const handlePostClick = (post) => {
    navigate('/post/${post.author}/${post.permlink}, { state: { post } }');
  };

  const handleDonateNavigate = () => {
    navigate('/donate');
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo">GreenPulse</div>
        <nav className="navigation">
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
          <div className="buttons">
            <button className="username-btn" onClick={() => navigate('/profile')}>{username}</button>
            <button className="publish-btn" onClick={() => navigate('/publish')}>Publish</button>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to GreenPulse</h1>
          <p>Your platform for eco-friendly living and sustainability.</p>
          <button onClick={handleDonateNavigate}>Donate Now</button>
        </div>
      </section>

      <section className="featured-posts">
        <h2>Recent Posts</h2>
        <div className="post-grid">
          {recentPosts.map((post, index) => (
            <article key={index} className="post-card" onClick={() => handlePostClick(post)}>
              <img src={(imageRegex.exec(post.body) ? imageRegex.exec(post.body)[0].slice(1, -1) : '')} alt="Post Thumbnail" className="post-image" />
              <div className="post-details">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-excerpt">{post.body.substring(0, 100)}...</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;