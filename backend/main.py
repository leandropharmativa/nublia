from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db_and_tables
from app.routers import root, users, agenda
from app.routers import codigos, atendimentos, formulas
from app.routers import agenda

from fastapi.openapi.utils import get_openapi

app = FastAPI(
    title="Nublia Backend"
)

# CORS: liberar acesso para o frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://nublia.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro de todas as rotas (routers)
app.include_router(root.router)
app.include_router(users.router)
app.include_router(agenda.router)
app.include_router(codigos.router)
app.include_router(atendimentos.router)
app.include_router(formulas.router)
app.include_router(agenda.router)

# Criação automática das tabelas no primeiro startup
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Customização do Swagger com autenticação JWT
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

app.openapi = custom_openapi
