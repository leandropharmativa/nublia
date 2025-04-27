🚀 Nublia
Sistema de atendimento e gestão para prescritores de saúde (nutricionistas, médicos, biomédicos, esteticistas) com integração a farmácias, clínicas e academias.

<p align="center"> <a href="https://nublia-backend.onrender.com/" target="_blank"> <img src="https://img.shields.io/badge/Render-Backend-green?style=for-the-badge" /> </a> <a href="https://nublia-frontend.vercel.app/" target="_blank"> <img src="https://img.shields.io/badge/Vercel-Frontend-blue?style=for-the-badge" /> </a> <img src="https://img.shields.io/badge/Made%20with-FastAPI-success?style=for-the-badge" /> <img src="https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge" /> </p>
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
🛠 Tecnologias Utilizadas

Backend	Frontend	Infraestrutura
FastAPI + SQLModel	React.js + Vite	Render (backend + banco)
PostgreSQL	TailwindCSS	Vercel (frontend)
Bcrypt (senhas)	Axios	GitHub
JWT (autenticação)	Lucide React Icons	
👨‍⚕️ Funcionalidades Implementadas
Cadastro e login de usuários

Paciente, Prescritor, Farmácia, Academia, Clínica

Proteção de perfis com código de ativação

Dashboard exclusivo para prescritor

Lista de atendimentos recentes com filtro por paciente

Iniciar atendimento via busca de paciente

Cadastro rápido de novo paciente

Controle de autenticação seguro via JWT

Interface responsiva e moderna

Deploy contínuo com GitHub → Vercel/Render

📋 Boas Práticas
Código limpo e 100% comentado

Separação por camadas (components, pages, routers)

Banco de dados PostgreSQL profissional

Tokens Bearer para segurança das rotas

Organização para crescimento do projeto a longo prazo

🔥 Próximas Etapas
Ficha de atendimento completa (anamnese, antropometria, exames)

Integração com farmácias e clínicas

Área exclusiva para pacientes (dieta, prescrições)

Sistema de notificações

Reagendamento e cancelamento de consultas

Upload de arquivos (exames, imagens)

✅ Status Atual

Módulo	Status
Backend API	✅
Frontend Interface	✅
Deploy Backend (Render)	✅
Deploy Frontend (Vercel)	✅
Integração GitHub Actions (opcional)	🔜
Ficha de Atendimento	🔜
📢 Projeto em expansão constante!
Feito para otimizar a saúde e inovar o atendimento de maneira digital, humanizada e acessível.

📎 Links rápidos:
Backend: https://nublia-backend.onrender.com/

Frontend: https://nublia-frontend.vercel.app/

