# 📄 backend/app/routers/formulas.py
# v1.1.1 — corrigida ordem de endpoints para evitar conflitos de rota

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlmodel import Session, select
from app.models import Formula, FormulaCreate, User
from app.database import engine, get_session

router = APIRouter()

# 🔵 Modelos auxiliares
class FormulaDeleteRequest(BaseModel):
    id: int

class FormulaUpdateRequest(FormulaCreate):
    id: int

# 🔵 Criar fórmula
@router.post("/formulas/")
def criar_formula(formula: FormulaCreate):
    with Session(engine) as session:
        nova_formula = Formula(**formula.dict())
        session.add(nova_formula)
        session.commit()
        session.refresh(nova_formula)
        return nova_formula

# ✅ NOVOS ENDPOINTS - precisam vir antes da rota por ID

# 🔵 Listar todas as fórmulas com autor (farmácia ou prescritor)
@router.get("/formulas/todas")
def listar_todas_formulas(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    session: Session = Depends(get_session)
):
    formulas = session.exec(
        select(Formula).offset(offset).limit(limit)
    ).all()
    resultado = []

    for f in formulas:
        if f.farmacia_id:
            farmacia = session.exec(select(User).where(User.id == f.farmacia_id)).first()
            autor = farmacia.name if farmacia else "Farmácia desconhecida"
        elif f.usuario_id:
            prescritor = session.exec(select(User).where(User.id == f.usuario_id)).first()
            autor = prescritor.name if prescritor else "Prescritor desconhecido"
        else:
            autor = "Autor desconhecido"

        resultado.append({
            "id": f.id,
            "nome": f.nome,
            "composicao": f.composicao,
            "indicacao": f.indicacao,
            "posologia": f.posologia,
            "autor": autor,
            "farmacia_id": f.farmacia_id,
            "usuario_id": f.usuario_id
        })

    return resultado

# 🔵 Listar fórmulas criadas por um prescritor (com paginação)
@router.get("/formulas/prescritor/{prescritor_id}")
def listar_formulas_por_prescritor(
    prescritor_id: int,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    session: Session = Depends(get_session)
):
    formulas = session.exec(
        select(Formula)
        .where(Formula.usuario_id == prescritor_id)
        .offset(offset)
        .limit(limit)
    ).all()
    return formulas

# 🔵 Listar fórmulas de uma farmácia — DEIXAR POR ÚLTIMO para evitar conflito de rota
@router.get("/formulas/{farmacia_id}")
def listar_formulas_por_farmacia(farmacia_id: int):
    with Session(engine) as session:
        formulas = session.exec(
            select(Formula).where(Formula.farmacia_id == farmacia_id)
        ).all()
        return formulas

# 🔵 Excluir fórmula via POST
@router.post("/formulas/delete")
def deletar_formula(payload: FormulaDeleteRequest, session: Session = Depends(get_session)):
    formula = session.get(Formula, payload.id)
    if not formula:
        raise HTTPException(status_code=404, detail="Fórmula não encontrada")
    session.delete(formula)
    session.commit()
    return {"ok": True}

# 🔵 Atualizar fórmula via POST
@router.post("/formulas/update")
def atualizar_formula(data: FormulaUpdateRequest, session: Session = Depends(get_session)):
    formula = session.get(Formula, data.id)
    if not formula:
        raise HTTPException(status_code=404, detail="Fórmula não encontrada")
    
    formula.nome = data.nome
    formula.composicao = data.composicao
    formula.indicacao = data.indicacao
    formula.posologia = data.posologia

    session.commit()
    session.refresh(formula)
    return formula
