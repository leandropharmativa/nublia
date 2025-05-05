# 🚀 Nublia

Sistema de atendimento e gestão para prescritores de saúde (nutricionistas, médicos, biomédicos, esteticistas) com integração a farmácias, clínicas e academias.

---

## 📂 Estrutura de Pastas

```
nublia/
├── README.md
├── estrutura.txt
├── backend/
│   ├── main.py
│   ├── readme.txt
│   ├── requirements.txt
│   └── app/
│       ├── database.py
│       ├── models.py
│       └── routers/
│           ├── agenda.py
│           ├── atendimentos.py
│           ├── codigos.py
│           ├── formulas.py
│           ├── pacientes.py
│           ├── root.py
│           └── users.py
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   ├── vite.config.js
│   ├── public/
│   │   └── favicon.png
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── components/
│       │   ├── AtendimentosRecentes.jsx
│       │   ├── Botao.jsx
│       │   ├── BuscarPacienteModal.jsx
│       │   ├── CadastrarPacienteModal.jsx
│       │   ├── CalendarioAgenda.jsx
│       │   ├── CalendarioCustom.css
│       │   ├── CampoTexto.jsx
│       │   ├── FichaAtendimento.jsx
│       │   ├── FormulaForm.jsx
│       │   ├── FormulaSidebar.jsx
│       │   ├── FormulasSugeridas.jsx
│       │   ├── Layout.jsx
│       │   ├── ListaAgendamentosAgenda.jsx
│       │   ├── MinhasFormulas.jsx
│       │   ├── ModalAgendarHorario.jsx
│       │   ├── ModalConfirmacao.jsx
│       │   ├── ModalFinalizado.jsx
│       │   ├── ModalMensagem.jsx
│       │   ├── ModalNovoAgendamento.jsx
│       │   ├── ModalNovoHorario.jsx
│       │   ├── PerfilPacienteModal.jsx
│       │   └── VisualizarAtendimentoModal.jsx
│       ├── pages/
│       │   ├── Admin.jsx
│       │   ├── AgendaPrescritor.jsx
│       │   ├── FarmaciaDashboard.jsx
│       │   ├── FichaAtendimento.jsx
│       │   ├── Login.jsx
│       │   ├── PrescritorDashboard.jsx
│       │   └── Register.jsx
│       ├── routes/
│       │   └── PrivateRoute.jsx
│       └── utils/
│           ├── cn.js
│           └── toastUtils.jsx
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
- Início de atendimento via busca ou agenda
- Cadastro rápido de novo paciente
- Cadastro, edição e exclusão de fórmulas por farmácias
- Visualização de fórmulas sugeridas pelos prescritores
- Modais para confirmação, visualização e perfil do paciente
- Agendamentos por horário com reagendamento e finalização
- Deploy contínuo GitHub → Vercel (frontend) / Render (backend)

---

## 📋 Boas Práticas

- Código limpo e comentado
- Separação clara por camadas (components, pages, routes)
- Banco PostgreSQL com ORM (SQLModel)
- Segurança com JWT e tokens Bearer
- Projeto modular e escalável

---

## 🔥 Próximas Etapas

- Ficha de atendimento completa (anamnese, antropometria, exames)
- Sistema de notificações internas
- Área exclusiva do paciente (dietas, prescrições, exames)
- Integração direta de fórmulas nas prescrições
- Upload de arquivos (exames, imagens)
- Histórico completo de atendimentos

---

## ✅ Status Atual

| Módulo                     | Status |
|----------------------------|--------|
| Backend API                | ✅     |
| Frontend Interface         | ✅     |
| Painel da Farmácia         | ✅     |
| Fórmulas Sugeridas         | ✅     |
| Agenda do Prescritor       | ✅     |
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
- Repositório: https://github.com/leandropharmativa/nublia/