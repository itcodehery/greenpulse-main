import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { KeychainSDK } from 'keychain-sdk';
import "./PublishPage.css";

const PublishPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(false);
  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handlePublish = async () => {
    const blogDetails = {
      title,
      content,
      tags: ['greenhive'], // Hardcoded tag
    };

    try {
      await publishBlogPostOnHive(blogDetails);
      alert('Post Published');
      navigate('/home');
    } catch (error) {
      alert('Error publishing post: ' + error.message);
    }
  };

  const handlePreviewToggle = () => {
    setPreview(!preview);
  };

  return (
    <div className="publish-container">
      <header className="publish-header">
        <div className="logo">GreenPulse</div>
        <nav className="navigation">
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </header>
      
      <div className="publish-form">
        <h1>Create a New Post</h1>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
          className="title-input"
        />
        
        <ReactQuill
          value={content}
          onChange={handleContentChange}
          className="text-editor"
          placeholder="Write your post content here..."
        />
        
        <input type="file" onChange={handleImageChange} className="image-upload" />
        
        {image && <img src={image} alt="Preview" className="image-preview" />}
        
        <div className="publish-buttons">
          <button onClick={handlePublish} className="publish-btn">Publish</button>
          <button onClick={handlePreviewToggle} className="preview-btn">
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>
      
      {preview && (
        <div className="post-preview">
          <h2>{title}</h2>
          <div dangerouslySetInnerHTML={{ __html: content }} />
          {image && <img src={image} alt="Post" />}
        </div>
      )}
    </div>
  );
};

export default PublishPage;

export const publishBlogPostOnHive = async (blogDetails) => {
  try {
    const { title, content, tags } = blogDetails;
    const username = localStorage.getItem('username');

    const body = `${content}\n\nPublished by @${username} on Hive.`;

    const permlink = `hive-blog-${Date.now()}`;

    const keychain = new KeychainSDK(window);

    const formParamsAsObject = {
      data: {
        username,
        title,
        body,
        parent_perm: 'blog',
        json_metadata: JSON.stringify({
          format: 'markdown',
          description: 'Hive Blog Post',
          tags,
        }),
        permlink,
        comment_options: JSON.stringify({
          author: username,
          permlink,
          max_accepted_payout: '10000.000 HBD',
          allow_votes: true,
          allow_curation_rewards: true,
          extensions: [],
          percent_hbd: 63,
        }),
      },
    };

    const post = await keychain.post(formParamsAsObject.data);
    return post;
  } catch (error) {
    console.error('Error publishing blog post:', error);
    throw error;
  }
};
