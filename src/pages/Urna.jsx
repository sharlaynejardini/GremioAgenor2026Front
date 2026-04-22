import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tela from '../components/Tela';

const Urna = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const navigate = useNavigate();

 

  return (
    <div>
      <Tela />
      
     
   </div>
  );
};

export default Urna;