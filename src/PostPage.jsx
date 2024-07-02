import React from 'react';
import { useLocation } from 'react-router-dom';
import { KeychainSDK } from 'keychain-sdk';
import './PostPage.css';
import { FaThumbsUp } from 'react-icons/fa';

const PostPage = () => {
  const location = useLocation();
  const { post } = location.state || { post: {} };

  const username = localStorage.getItem('username');

  if (!post) {
    return <div>Post not found</div>;
  }

  const handleUpvote = async () => {
    try {
      const keychain = new KeychainSDK(window);
      const voteParams = {
        data: {
          username: username,
          permlink: post.permlink,
          author: post.author,
          weight: 10000, // 100% upvote
        },
      };
      const vote = await keychain.vote(voteParams.data);
      console.log({ vote });
      if (vote.success) {
        alert('Upvote successful!');
      } else {
        alert('Upvote failed.');
      }
    } catch (error) {
      console.error('Error while upvoting:', error);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo">GreenPulse</div>
      </header>

      <article className="blog-post">
        <div className="post-header">
          <h1 className="post-title">{post.title}</h1>
          <hr className="divider" />
        </div>
        <div className="post-meta">
          <span>Author: {post.author}</span>
        </div>
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.body }} style={{ color: 'black' }}></div>

        <div className="post-actions">
          <button className="upvote-button" onClick={handleUpvote}>
            <FaThumbsUp /> Upvote
          </button>
        </div>
      </article>
    </div>
  );
};

export default PostPage;