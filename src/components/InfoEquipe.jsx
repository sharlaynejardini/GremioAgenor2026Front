import React from 'react';
import './InfoEquipe.css';

const imagensPorNumero = {
  10: 'Pensadores.png',
  20: 'eternos.png',
  30: 'Tigrão.png'
};

const getImagemChapa = (equipe) => {
  const arquivo = imagensPorNumero[equipe?.numero] || `chapa-${equipe?.numero}.png`;
  return `/imagens/${arquivo}`;
};

const InfoEquipe = ({ equipe, branco, nulo }) => {
  if (branco) {
    return (
      <div className="info-equipe branco">
        <div className="info-icon">✉️</div>
        <div className="info-titulo">VOTO EM BRANCO</div>
      </div>
    );
  }

  if (nulo) {
    return (
      <div className="info-equipe nulo">
        <div className="info-icon">❌</div>
        <div className="info-titulo">VOTO NULO</div>
      </div>
    );
  }

  if (equipe) {
    return (
      <div className="info-equipe valido">
        <div className="info-dados-chapa">
          <div className="info-numero-chapa">{equipe.numero}</div>
          <div className="info-nome-chapa">{equipe.nome}</div>
        </div>
        <div className="info-imagem-container">
          <img 
            src={getImagemChapa(equipe)} 
            alt={`Chapa ${equipe.nome}`}
            onError={(e) => {
              e.target.src = '/vite.svg';
              e.target.className = 'default-image';
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="info-equipe vazio">
      <div className="info-icon">⌨️</div>
      <div className="info-titulo">AGUARDANDO DIGITAÇÃO</div>
    </div>
  );
};

export default InfoEquipe;
