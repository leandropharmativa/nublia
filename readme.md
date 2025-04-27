Nublia
Sistema online de atendimento para prescritores de saúde (nutricionistas, biomédicos, médicos, esteticistas) com integração a farmácias, clínicas e academias.

📂 Estrutura de Pastas
bash
Copiar
Editar
backend/
  ├── app/
  │   ├── database.py
  │   ├── models.py
  │   └── routers/
  │       ├── root.py
  │       ├── users.py
  │       ├── pacientes.py
  │       ├── agenda.py
  │       └── codigos.py
  ├── main.py
  └── requirements.txt

frontend/
  ├── src/
  │   ├── components/
  │   │   ├── CadastrarPacienteModal.jsx
  │   │   └── BuscarPacienteModal.jsx
  │   ├── pages/
  │   │   ├── Login.jsx
  │   │   ├── Register.jsx
  │   │   ├── AdminDashboard.jsx
  │   │   └── PrescritorDashboard.jsx
  │   ├── App.jsx
  │   ├── main.jsx
  │   ├── index.css
  ├── package.json
  ├── tailwind.config.js
  ├── postcss.config.js
  ├── vite.config.js
  ├── index.html
  └── vercel.json
✅ Observações:

A pasta public/ foi removida — agora o roteamento é feito diretamente no React.

O vercel.json define regras de build e roteamento no deploy da Vercel.

🛠 Tecnologias Utilizadas

Backend	Frontend	Infra
FastAPI + SQLModel	React.js + Vite	Render (Backend + Banco de Dados)
PostgreSQL	TailwindCSS	Vercel (Frontend)
JWT para autenticação	Axios para requisições	GitHub para versionamento
Bcrypt para senhas	Lucide React Icons	
👨‍⚕️ Funcionalidades
Registro de pacientes

Cadastro e login de usuários: prescritores, farmácias, academias, clínicas, pacientes e admin

Gerenciamento de códigos de ativação para acesso restrito

Painel do prescritor com:

Lista de atendimentos recentes

Filtro de pacientes

Início de atendimento via busca/cadastro de paciente

Cadastro de pacientes novos dentro do fluxo de atendimento

Proteção de rotas por token JWT

Interface responsiva e moderna

📋 Boas Práticas Adotadas
Código limpo e comentado

Separação de components e pages no frontend

Divisão de routers no backend para melhor organização

Armazenamento seguro de senhas usando Bcrypt

Uso de token Bearer para autenticação segura

Arquivos .env e variáveis sensíveis gerenciáveis (em breve)

🔥 Próximas Etapas
Sistema completo de ficha de atendimento para prescritores

Agenda visual de compromissos (fullcalendar ou similar)

Gestão de receitas e envio para farmácias integradas

Área do paciente para visualizar dietas e prescrições

Área da farmácia, academia e clínica para interação

Recuperação de senha por email (opcional)

✅ Status Atual
Backend: ✅ Pronto e em produção (Render Backend)

Frontend: ✅ Pronto e em produção (Vercel Frontend)

Integrações: ✅ API funcional

Banco de dados: ✅ PostgreSQL na Render

Controle de usuários: ✅ Finalizado

Controle de pacientes: ✅ Finalizado

🚀 Nublia está crescendo!
Projeto em constante evolução, feito para facilitar o atendimento e melhorar a saúde com tecnologia!
