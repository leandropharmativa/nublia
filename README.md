# 🚀 Nublia

Sistema de atendimento e gestão para prescritores de saúde (nutricionistas, médicos, biomédicos, esteticistas) com integração a farmácias, clínicas e academias.

---

## 📂 Estrutura de Pastas

```
nublia/
├─ backend/
│  ├─ app/
│  │  ├─ database.py
│  │  ├─ models.py
│  │  ├─ routers/
│  │  │  ├─ agenda.py
│  │  │  ├─ atendimentos.py
│  │  │  ├─ codigos.py
│  │  │  ├─ formulas.py
│  │  │  ├─ pacientes.py
│  │  │  ├─ root.py
│  │  │  ├─ users.py
│  ├─ main.py
│  ├─ requirements.txt
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ AtendimentosRecentes.jsx
│  │  │  ├─ BuscaPacienteModal.jsx
│  │  │  ├─ CadastrarPacienteModal.jsx
│  │  │  ├─ FichaAtendimento.jsx
│  │  │  ├─ FormulaForm.jsx
│  │  │  ├─ FormulaSidebar.jsx
│  │  │  ├─ ModalConfirmacao.jsx
│  │  │  ├─ ModalMensagem.jsx
│  │  │  ├─ PerfilPacienteModal.jsx
│  │  │  ├─ VisualizarAtednimentoModal.jsx
│  │  ├─ pages/
│  │  │  ├─ Admin.jsx
│  │  │  ├─ FarmaciaDashboard.jsx
│  │  │  ├─ FichaAtendimento.jsx
│  │  │  ├─ Login.jsx
│  │  │  ├─ PrescritorDashboard.jsx
│  │  │  ├─ Register.jsx
│  │  ├─ App.jsx
│  │  ├─ index.css
│  │  ├─ main.jsx
│  ├─ index.html
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ tailwind.config.js
│  ├─ vercel.json
│  ├─ vite.config.js
```

---

## 🛠 Tecnologias Utilizadas

| Backend            | Frontend              | Infraestrutura         |
|--------------------|------------------------|-------------------------|
| FastAPI + SQLModel | React.js + Vite        | Render (backend + banco) |
| PostgreSQL         | TailwindCSS            | Vercel (frontend)        |
| Bcrypt (senhas)    | Axios                  | GitHub                   |
| JWT (autenticação) | Lucide React Icons     |                         |

---

## 👨‍⚕️ Funcionalidades Implementadas

- Cadastro e login de usuários:
  - Paciente, Prescritor, Farmácia, Academia, Clínica
- Proteção de perfis com código de ativação
- Dashboard exclusivo para prescritor
- Lista de atendimentos recentes com filtro por paciente
- Iniciar atendimento via busca de paciente
- Cadastro rápido de novo paciente
- Cadastro e gerenciamento de fórmulas por farmácias
- Interface com múltiplos modais de interação (confirmação, visualização, perfil)
- Controle de autenticação seguro via JWT
- Interface responsiva e moderna
- Deploy contínuo com GitHub → Vercel/Render

---

## 📋 Boas Práticas

- Código limpo e 100% comentado
- Separação por camadas (components, pages, routers)
- Banco de dados PostgreSQL profissional
- Tokens Bearer para segurança das rotas
- Organização para crescimento do projeto a longo prazo

---

## 🔥 Próximas Etapas

- Ficha de atendimento completa (anamnese, antropometria, exames)
- Integração com farmácias e clínicas
- Área exclusiva para pacientes (dietas, prescrições)
- Sistema de notificações
- Reagendamento e cancelamento de consultas
- Upload de arquivos (exames, imagens)

---

## ✅ Status Atual

| Módulo                     | Status |
|----------------------------|--------|
| Backend API                | ✅     |
| Frontend Interface         | ✅     |
| Deploy Backend (Render)    | ✅     |
| Deploy Frontend (Vercel)   | ✅     |
| Integração GitHub Actions  | 🔜     |
| Ficha de Atendimento       | 🔜     |

---

## 📢 Projeto em expansão constante!
Feito para otimizar a saúde e inovar o atendimento de maneira digital, humanizada e acessível.

---

## 📎 Links rápidos

- Backend: https://nublia-backend.onrender.com/
- Frontend: https://nublia-frontend.vercel.app/
