import React from 'react';
import './InfoEquipe.css';

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
        <div className="info-numero-chapa">{equipe.numero}</div>
        <div className="info-nome-chapa">{equipe.nome}</div>
        <div className="info-imagem-container">
          <img 
            src={`/imagens/chapa-${equipe.numero}.png`} 
            alt={`Chapa ${equipe.nome}`}
            onError={(e) => {
              e.target.src = '/imagens/default.png';
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