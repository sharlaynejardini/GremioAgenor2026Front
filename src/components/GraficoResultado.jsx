// src/components/GraficoResultado.jsx
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const cores = ['#4a90e2', '#50e3c2', '#f5a623', '#f85f73', '#7b68ee'];

const GraficoResultado = ({ dados }) => {
  return (
    <div className="container mt-5 p-4 bg-white rounded shadow text-center">
      <h2 className="mb-4">Resultado da Votação</h2>
      <div className="row">
        
        <div className="col-md-6">
          <h4 className="mb-3">Gráfico de Pizza</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dados}
                dataKey="votos"
                nameKey="nome"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {dados.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GraficoResultado;
