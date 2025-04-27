# Importa o SQLModel para definir as tabelas e o create_engine para conectar ao banco
from sqlmodel import SQLModel, create_engine
import os  # Para pegar variáveis de ambiente (como a URL do banco)

# Define a variável de conexão
# Pega a variável de ambiente DATABASE_URL se existir, senão usa SQLite localmente (para testes locais)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://nublia:zjilU8UV2f69HShkbFnMYz4BTfebOKl0@dpg-d06grqbuibrs73ej6d90-a.oregon-postgres.render.com/nublia_db")

# Cria o motor de conexão
engine = create_engine(DATABASE_URL, echo=True)  
# echo=True faz o SQL ser exibido no terminal para debug — depois podemos mudar para False

# Função que cria as tabelas no banco (caso não existam)
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
