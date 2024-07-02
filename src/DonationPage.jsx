import React, { useState } from 'react';
import { KeychainSDK } from 'keychain-sdk';
import './DonationPage.css';

const projects = [
  { id: 1, name: 'Tree Plantation Drive', description: 'Help us plant more trees in urban areas.', amountRaised: 0.0 },
  { id: 2, name: 'Clean Water Initiative', description: 'Providing clean water to underprivileged communities.', amountRaised: 0.0 },
  { id: 3, name: 'Renewable Energy Project', description: 'Support the development of renewable energy sources.', amountRaised: 0.0 },
  { id: 4, name: 'Sustainable Farming', description: 'Promoting sustainable farming practices.', amountRaised: 0.0 },
  { id: 5, name: 'Waste Reduction Campaign', description: 'Initiatives to reduce waste and promote recycling.', amountRaised: 0.0 },
];

const DonationPage = () => {
  const [donationAmount, setDonationAmount] = useState('');
  const [isDonating, setIsDonating] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectsState, setProjectsState] = useState(projects);

  const username = localStorage.getItem('username');

  const handleDonate = async (project) => {
    const amount = parseFloat(donationAmount);
    if (!donationAmount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    setIsDonating(true);
    try {
      const keychain = new KeychainSDK(window);
      const transferParams = {
        data: {
          username: username,
          to: 'hariprasadd',
          amount: amount.toFixed(3),
          memo: 'Donation to ${project.name}',
          enforce: false,
          currency: 'HIVE',
        },
      };
      const transfer = await keychain.transfer(transferParams.data);
      console.log({ transfer });
      if (transfer.success) {
        alert('Donation to ${project.name} successful!');
        const updatedProjects = projectsState.map(p =>
          p.id === project.id ? { ...p, amountRaised: (p.amountRaised + amount).toFixed(3) } : p
        );
        setProjectsState(updatedProjects);
      } else {
        alert('Donation to ${project.name} failed.');
      }
    } catch (error) {
      console.error('Error while donating:', error);
      alert('An error occurred while donating. Please try again.');
    } finally {
      setIsDonating(false);
      setDonationAmount('');
    }
  };

  return (
    <div className="donation-page-container">
      <header className="donation-header">
        <div className="donation-logo">GreenPulse</div>
        <h1 className="donation-title">Support Sustainability Projects</h1>
      </header>
      <div className="projects-container">
        {projectsState.map((project) => (
          <div key={project.id} className="project-card">
            <h2 className="project-name">{project.name}</h2>
            <p className="project-description">{project.description}</p>
            <p className="project-amount-raised">Amount Raised: {project.amountRaised} HIVE</p>
            <input
              type="number"
              step="0.001"
              placeholder="Amount in HIVE"
              value={selectedProject === project.id ? donationAmount : ''}
              onChange={(e) => {
                setDonationAmount(e.target.value);
                setSelectedProject(project.id);
              }}
              disabled={isDonating && selectedProject === project.id}
              className="donation-input"
            />
            <button
              className="donate-button"
              onClick={() => handleDonate(project)}
              disabled={isDonating && selectedProject === project.id}
            >
              {isDonating && selectedProject === project.id ? 'Donating...' : 'Donate'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationPage;