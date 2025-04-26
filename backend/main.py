from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db_and_tables
from app.routers import root, users, pacientes, agenda

app = FastAPI()

# Permitir que o frontend acesse o backend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Pode trocar "*" por URL específica depois, se quiser mais seguro
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir todos os routers
app.include_router(root.router)
app.include_router(users.router)
app.include_router(pacientes.router)
app.include_router(agenda.router)

# Evento que roda no início para criar o banco de dados (se não existir)
@app.on_event("startup")
def on_startup():
    create_db_and_tables()
