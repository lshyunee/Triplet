import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Triplet</h1>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: '24px',
    color: '#333',
  },
};

export default SplashScreen;