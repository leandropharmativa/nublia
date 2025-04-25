from sqlmodel import SQLModel, create_engine
import os

# Pega a variável de ambiente DATABASE_URL ou usa SQLite local como fallback
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
