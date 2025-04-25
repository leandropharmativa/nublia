# Importa o APIRouter do FastAPI para organizar as rotas
from fastapi import APIRouter

# Cria o roteador principal
router = APIRouter()

# Rota simples para testar se o backend está rodando
@router.get("/")
def read_root():
    return {"message": "Bem-vindo ao Nublia!"}
