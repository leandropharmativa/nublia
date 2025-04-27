from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db_and_tables
from app.routers import root, users, pacientes, agenda
from app.routers import codigos
from fastapi.openapi.utils import get_openapi
from app.routers import atendimentos

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
app.include_router(codigos.router)
app.include_router(atendimentos.router)

# Evento que roda no início para criar o banco de dados (se não existir)
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Nublia API",
        version="1.0.0",
        description="Documentação da API Nublia",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    for path in openapi_schema["paths"].values():
        for operation in path.values():
            operation["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

# Ativar o esquema customizado
app.openapi = custom_openapi
