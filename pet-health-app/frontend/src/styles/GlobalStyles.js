import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
  }

  input, textarea {
    font-family: inherit;
    outline: none;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .btn {
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
  }

  .btn-secondary:hover {
    background: #5a6268;
  }

  .btn-success {
    background: #28a745;
    color: white;
  }

  .btn-success:hover {
    background: #218838;
  }

  .btn-danger {
    background: #dc3545;
    color: white;
  }

  .btn-danger:hover {
    background: #c82333;
  }

  .btn-outline {
    background: transparent;
    border: 2px solid #667eea;
    color: #667eea;
  }

  .btn-outline:hover {
    background: #667eea;
    color: white;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #555;
  }

  .form-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s ease;
  }

  .form-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .form-select {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 16px;
    background-color: white;
    cursor: pointer;
  }

  .card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  .card-header {
    padding: 20px;
    border-bottom: 1px solid #e9ecef;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  }

  .card-body {
    padding: 20px;
  }

  .risk-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .risk-low {
    background: #d4edda;
    color: #155724;
  }

  .risk-medium {
    background: #fff3cd;
    color: #856404;
  }

  .risk-high {
    background: #f8d7da;
    color: #721c24;
  }

  .risk-urgent {
    background: #f5c6cb;
    color: #721c24;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(220, 53, 69, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
    }
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error {
    background: #f8d7da;
    color: #721c24;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid #f5c6cb;
  }

  .success {
    background: #d4edda;
    color: #155724;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid #c3e6cb;
  }

  @media (max-width: 768px) {
    .container {
      padding: 0 15px;
    }
    
    .btn {
      padding: 10px 20px;
      font-size: 14px;
    }
    
    .card-body {
      padding: 15px;
    }
  }
`;

export default GlobalStyles;
