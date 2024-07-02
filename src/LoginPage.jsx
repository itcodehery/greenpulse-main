import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { KeychainSDK, KeychainKeyTypes } from 'keychain-sdk';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleHiveKeyChainLogin = async () => {
    if (!window.hive_keychain) {
      toast.error('Please install Hive Keychain extension!');
      return;
    }
    if (!username) {
      toast.error('Enter your Hive Username!');
      return;
    }

    setIsLoggingIn(true);

    try {
      const keychain = new KeychainSDK(window);
      const loginParams = {
        data: {
          username,
          message: 'Login Request',
          method: KeychainKeyTypes.posting,
          title: 'Login',
        },
      };

      const login = await keychain.login(loginParams.data);
      if (login.success) {
        toast.success('Login successful!');
        console.log('Login successful:', { login });

        localStorage.setItem('username', username);
        localStorage.setItem('publicKey', login.data.key);

        navigate('/home');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error while Hive Keychain Login:', error);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignup = () => {
    // Logic for signing up a new user using Hive Keychain
    // This should include creating a new account on Hive blockchain
    toast.info('Signup feature coming soon!');
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>GreenPulse</h1>
        <p style={styles.subtitle}>Join the Community for Sustainable Living</p>
        <input
          style={styles.input}
          type='text'
          placeholder='Enter Hive Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleHiveKeyChainLogin();
            }
          }}
          disabled={isLoggingIn}
        />
        <button
          onClick={handleHiveKeyChainLogin}
          style={styles.button}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? 'Logging in...' : 'Login'}
        </button>
        <p style={styles.instructions}>
          Don't have an account? <span onClick={handleSignup} style={styles.link}>Sign up</span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundImage: 'url(/path/to/your/background/image.jpg)', // Add your background image here
  },
  content: {
    textAlign: 'center',
    padding: '40px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
  },
  title: {
    fontSize: '3em',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
  },
  subtitle: {
    fontSize: '1.2em',
    marginBottom: '30px',
    color: '#555',
  },
  input: {
    width: '100%',
    maxWidth: '400px',
    padding: '12px',
    fontSize: '1.25em',
    borderRadius: '8px',
    border: '1px solid #ccc',
    marginBottom: '20px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    maxWidth: '400px',
    padding: '12px',
    fontSize: '1.25em',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    boxSizing: 'border-box',
  },
  instructions: {
    fontSize: '1em',
    marginTop: '20px',
    color: '#555',
  },
  link: {
    color: '#28a745',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 0.3s',
  },
};

export default LoginPage;
