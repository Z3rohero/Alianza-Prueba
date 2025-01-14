from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel, Field
from typing import Optional
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ActividadAgronomicas(Base):
    __tablename__ = "ActividadAgronomicas"
    id = Column(Integer, primary_key=True, index=True)
    nombreParcela = Column(String, nullable=False)
    latitud = Column(String, nullable=True)
    longitud = Column(String, nullable=True)
    UltimoRiego = Column(String, nullable=True)
    UltimaFertilizacion = Column(String, nullable=True)

Base.metadata.create_all(bind=engine)

class ActividadAgronomicasCreate(BaseModel):
    nombreParcela: str
    latitud: Optional[str] = None
    longitud: Optional[str] = None
    UltimoRiego: Optional[str] = None
    UltimaFertilizacion: Optional[str] = None

class ActividadAgronomicasOut(BaseModel):
    id: int
    nombreParcela: str
    latitud: str
    longitud: str
    UltimoRiego: str
    UltimaFertilizacion: str

    class Config:
        orm_mode = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/parcelas/", response_model=list[ActividadAgronomicasOut])
def read_parcelas(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    parcelas = db.query(ActividadAgronomicas).offset(skip).limit(limit).all()
    return parcelas

@app.post("/parcelas/", response_model=ActividadAgronomicasOut)
def create_parcela(parcela: ActividadAgronomicasCreate, db: Session = Depends(get_db)):
    db_parcela = ActividadAgronomicas(
        nombreParcela=parcela.nombreParcela,
        latitud=parcela.latitud,
        longitud=parcela.longitud,
        UltimoRiego=parcela.UltimoRiego,
        UltimaFertilizacion=parcela.UltimaFertilizacion,
    )
    db.add(db_parcela)
    db.commit()
    db.refresh(db_parcela)
    return db_parcela
