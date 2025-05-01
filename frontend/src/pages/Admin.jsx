import Layout from '../components/Layout'

export default function AdminDashboard() {
  return (
    <Layout>
      <h2 className="text-title mb-6">Painel Administrativo</h2>

      {/* Cards resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow-sm">
          <p className="text-sm text-gray-500">Prescritores</p>
          <p className="text-2xl font-bold">38</p>
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <p className="text-sm text-gray-500">Pacientes</p>
          <p className="text-2xl font-bold">812</p>
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <p className="text-sm text-gray-500">Farmácias</p>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <p className="text-sm text-gray-500">Códigos gerados</p>
          <p className="text-2xl font-bold">57</p>
        </div>
      </div>

      {/* Área futura: Filtros e Tabela de Usuários */}
      <div className="bg-white p-6 rounded shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Usuários cadastrados</h3>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <select className="input-base">
            <option>Todos os tipos</option>
            <option>Prescritores</option>
            <option>Pacientes</option>
            <option>Farmácias</option>
            <option>Clínicas</option>
            <option>Academias</option>
          </select>

          <input
            type="text"
            placeholder="Buscar por nome ou email"
            className="input-base"
          />
        </div>

        {/* Mock tabela */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Nome</th>
              <th className="py-2">Email</th>
              <th className="py-2">Tipo</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="py-2">Dra. Marina Lopes</td>
              <td className="py-2">marina@nutri.com</td>
              <td className="py-2">Prescritor</td>
              <td className="py-2 text-green-600">Ativo</td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <td className="py-2">Clínica Equilíbrio</td>
              <td className="py-2">contato@equilibrio.com</td>
              <td className="py-2">Clínica</td>
              <td className="py-2 text-yellow-600">Pendente</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
