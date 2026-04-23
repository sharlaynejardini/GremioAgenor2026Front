import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faChartBar, 
  faTable, 
  faRefresh,
  faPrint 
} from '@fortawesome/free-solid-svg-icons';
import './Resultados.css';

const ordenarPorNome = (lista) =>
  [...lista].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

const normalizarTexto = (valor = '') =>
  valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const getNomeChapaExibicao = (nome, numero) => {
  if (Number(numero) === 30) return 'Lunar';
  if (normalizarTexto(nome).includes('tigrao')) return 'Lunar';
  return nome;
};

const Resultados = () => {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [activeTab, setActiveTab] = useState('grafico');
  const navigate = useNavigate();

  const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#7c3aed'];

  useEffect(() => {
    fetchResultados();
  }, []);

  const fetchResultados = async () => {
    setLoading(true);
    try {
      const res = await api.get('/votos/resultados');
      const dadosFormatados = ordenarPorNome(
        res.data.map((item) => ({
          ...item,
          nome: getNomeChapaExibicao(item.nomeChapa, item.numeroChapa ?? item.numero),
          votos: item.totalVotos
        }))
      ).map((item, index) => ({
        ...item,
        fill: COLORS[index % COLORS.length]
      }));
      setDados(dadosFormatados);
    } catch (err) {
      setErro('Erro ao buscar resultados. Tente recarregar.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  const totalVotos = dados.reduce((sum, item) => sum + item.votos, 0);
  const chapaMaisVotada = dados.reduce(
    (maior, item) => (item.votos > (maior?.votos ?? -1) ? item : maior),
    null
  );
  const percentualMaisVotada = totalVotos && chapaMaisVotada
    ? ((chapaMaisVotada.votos / totalVotos) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="resultados-container">
      {/* Cabeçalho de impressão (visível apenas na impressão) */}
      <div className="print-header">
        <h1>Resultado das Eleições</h1>
        <p>Eleição {new Date().getFullYear()} - Gerado em: {new Date().toLocaleString('pt-BR')}</p>
      </div>

      <div className="resultados-card shadow">
        <div className="card-header-primary">
          <div className="header-title">
            <span className="header-icon">
              <FontAwesomeIcon icon={faChartBar} />
            </span>
            <div>
              <h2>Resultados da Votação</h2>
              <p>Grêmio Estudantil 2026</p>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="btn-refresh"
              onClick={fetchResultados}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faRefresh} className={loading ? "fa-spin" : ""} />
              {loading ? ' Atualizando...' : ' Atualizar'}
            </button>
            <button 
              className="btn-print"
              onClick={handleImprimir}
            >
              <FontAwesomeIcon icon={faPrint} className="me-1" />
              Imprimir
            </button>
            <button 
              className="btn-home"
              onClick={() => navigate('/')}
            >
              <FontAwesomeIcon icon={faHome} className="me-1" />
              Voltar
            </button>
          </div>
        </div>
        
        <div className="card-body">
          {erro && (
            <div className="alert-error">
              <span>{erro}</span>
              <button className="btn-try-again" onClick={fetchResultados}>
                Tentar novamente
              </button>
            </div>
          )}

          <div className="dashboard-metrics">
            <div className="metric-card total-card">
              <span className="metric-label">Total de votos</span>
              <strong>{totalVotos}</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Chapas</span>
              <strong>{dados.length}</strong>
            </div>
            <div className="metric-card winner-card">
              <span className="metric-label">Mais votada</span>
              <strong>{chapaMaisVotada?.nome || '-'}</strong>
              <small>{percentualMaisVotada}% dos votos</small>
            </div>
          </div>

          {!loading && dados.length > 0 && (
            <div className="candidate-cards">
              {dados.map((item) => {
                const percentual = totalVotos ? (item.votos / totalVotos) * 100 : 0;

                return (
                  <div className="candidate-card" key={item.nome}>
                    <div className="candidate-card-header">
                      <span className="candidate-dot" style={{ backgroundColor: item.fill }}></span>
                      <strong>{item.nome}</strong>
                    </div>
                    <div className="candidate-card-body">
                      <span>{item.votos} votos</span>
                      <b>{percentual.toFixed(1)}%</b>
                    </div>
                    <div className="candidate-card-track">
                      <div
                        className="candidate-card-bar"
                        style={{
                          width: `${percentual}%`,
                          backgroundColor: item.fill
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="results-summary">
            <div className="tab-buttons">
              <button
                className={`tab-btn ${activeTab === 'grafico' ? 'active' : ''}`}
                onClick={() => setActiveTab('grafico')}
              >
                <FontAwesomeIcon icon={faChartBar} /> Gráfico
              </button>
              <button
                className={`tab-btn ${activeTab === 'tabela' ? 'active' : ''}`}
                onClick={() => setActiveTab('tabela')}
              >
                <FontAwesomeIcon icon={faTable} /> Tabela
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner" role="status"></div>
              <p>Carregando resultados...</p>
            </div>
          ) : dados.length > 0 ? (
            <>
              {activeTab === 'grafico' && (
                <div className="charts-grid">
                  <div className="chart-card">
                    <div className="chart-header">
                      <h3>Distribuição de Votos</h3>
                    </div>
                    <div className="chart-wrapper">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dados}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="nome" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="votos" name="Votos" radius={[4, 4, 0, 0]}>
                            {dados.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="chart-card">
                    <div className="chart-header">
                      <h3>Percentual de Votos</h3>
                    </div>
                    <div className="chart-wrapper">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dados}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            dataKey="votos"
                            nameKey="nome"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                          >
                            {dados.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value, name, props) => [
                              value,
                              `${name}: ${totalVotos ? ((value / totalVotos) * 100).toFixed(1) : '0.0'}%`
                            ]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tabela' && (
                <div className="table-section">
                  <div className="table-responsive">
                    <table className="results-table">
                      <thead>
                        <tr>
                          <th>Posição</th>
                          <th>Chapa</th>
                          <th>Votos</th>
                          <th>Percentual</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dados.map((item, index) => (
                            <tr key={item.nome}>
                              <td className="position">{index + 1}º</td>
                              <td className="candidate">
                                <span 
                                  className="color-badge" 
                                  style={{ backgroundColor: item.fill }}
                                ></span>
                                {item.nome}
                              </td>
                              <td className="votes">{item.votos}</td>
                              <td className="percentage">
                                <div className="progress-container">
                                  <div
                                    className="progress-bar"
                                    style={{ 
                                      width: `${totalVotos ? (item.votos / totalVotos) * 100 : 0}%`,
                                      backgroundColor: item.fill
                                    }}
                                  >
                                    <span className="progress-text">
                                      {totalVotos ? (item.votos / totalVotos * 100).toFixed(1) : '0.0'}%
                                    </span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <FontAwesomeIcon icon={faChartBar} size="2x" />
              <p>Nenhum resultado disponível para exibição</p>
            </div>
          )}

          {!loading && dados.length > 0 && (
            <div className="print-only print-results">
              <div className="print-chart-card">
                <h3>Percentual de Votos</h3>
                <PieChart width={420} height={260}>
                  <Pie
                    data={dados}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={92}
                    dataKey="votos"
                    nameKey="nome"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {dados.map((entry, index) => (
                      <Cell key={`print-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </div>

              <div className="print-table-card">
                <h3>Resumo por chapa</h3>
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Chapa</th>
                      <th>Votos</th>
                      <th>Percentual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dados.map((item) => (
                      <tr key={`print-${item.nome}`}>
                        <td>{item.nome}</td>
                        <td>{item.votos}</td>
                        <td>{totalVotos ? (item.votos / totalVotos * 100).toFixed(1) : '0.0'}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resultados;
