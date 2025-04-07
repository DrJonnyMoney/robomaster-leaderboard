# main.py
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional


# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./robotics_leaderboard.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database model
class Participant(Base):
    __tablename__ = "participants"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    school = Column(String)
    avatar = Column(String)
    score = Column(Integer)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models for request/response
class ParticipantBase(BaseModel):
    name: str
    school: str
    avatar: str
    score: int

class ParticipantCreate(ParticipantBase):
    pass

class ParticipantResponse(ParticipantBase):
    id: int
    
    class Config:
        orm_mode = True

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize FastAPI
app = FastAPI(title="Robotics Leaderboard API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Mount static files
app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")
# Mount images directory if it exists separately
app.mount("/images", StaticFiles(directory="static/images"), name="images")

# Add a route for the root path to serve the index.html
@app.get("/", include_in_schema=False)
async def serve_frontend():
    return FileResponse("static/index.html")

# API Routes
@app.get("/")
def read_root():
    return {"message": "Robotics Challenge Leaderboard API"}

@app.get("/participants/", response_model=List[ParticipantResponse])
def read_participants(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    participants = db.query(Participant).order_by(Participant.score.desc()).offset(skip).limit(limit).all()
    return participants

@app.post("/participants/", response_model=ParticipantResponse)
def create_participant(participant: ParticipantCreate, db: Session = Depends(get_db)):
    db_participant = Participant(**participant.dict())
    db.add(db_participant)
    db.commit()
    db.refresh(db_participant)
    return db_participant

@app.get("/participants/{participant_id}", response_model=ParticipantResponse)
def read_participant(participant_id: int, db: Session = Depends(get_db)):
    db_participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if db_participant is None:
        raise HTTPException(status_code=404, detail="Participant not found")
    return db_participant

@app.put("/participants/{participant_id}", response_model=ParticipantResponse)
def update_participant(participant_id: int, participant: ParticipantCreate, db: Session = Depends(get_db)):
    db_participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if db_participant is None:
        raise HTTPException(status_code=404, detail="Participant not found")
    
    for key, value in participant.dict().items():
        setattr(db_participant, key, value)
    
    db.commit()
    db.refresh(db_participant)
    return db_participant

@app.delete("/participants/{participant_id}")
def delete_participant(participant_id: int, db: Session = Depends(get_db)):
    db_participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if db_participant is None:
        raise HTTPException(status_code=404, detail="Participant not found")
    
    db.delete(db_participant)
    db.commit()
    return {"message": "Participant deleted successfully"}

# Add some initial data if the database is empty
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    count = db.query(Participant).count()
    
    if count == 0:
        if count == 0:
            initial_data = [
            {"name": "Circuit Schwarzenegger", "school": "Terminator Tech", "avatar": "robot1", "score": 950},
            {"name": "Byte Lasso", "school": "Ted TV Institute", "avatar": "computer", "score": 925},
            {"name": "Elon Rust", "school": "Mars Robotics", "avatar": "rocket", "score": 890},
            {"name": "Bill Gateways", "school": "Windows Academy", "avatar": "gear", "score": 875},
            {"name": "Steve Bots", "school": "Apple Automation", "avatar": "robot2", "score": 860},
            {"name": "Ada Lovelbot", "school": "Algorithm High", "avatar": "scientist", "score": 840},
            {"name": "Robo Downey Jr.", "school": "Iron Tech Institute", "avatar": "gear", "score": 820},
            {"name": "Mark Zucker-borg", "school": "Meta Mechanics", "avatar": "robot1", "score": 800},
            {"name": "Servo Willis", "school": "Die Hard Devices", "avatar": "gear", "score": 780},
            {"name": "Taylor Shift", "school": "Swift Programming", "avatar": "rocket", "score": 760},
            {"name": "Dwayne 'The Bot' Johnson", "school": "Rock Solid Robotics", "avatar": "robot2", "score": 745},
            {"name": "Optimus Beyoncé", "school": "Single Ladies Circuits", "avatar": "robot1", "score": 730},
            {"name": "Lady Java", "school": "Bad Codeance", "avatar": "computer", "score": 715},
            {"name": "Bit Pitt", "school": "Hollywood Hardware", "avatar": "gear", "score": 700},
            {"name": "Ariana Grep", "school": "Thank U, Next-Gen Tech", "avatar": "scientist", "score": 685},
            {"name": "Chris Hardwired", "school": "Marvel Mechanics", "avatar": "robot2", "score": 670},
            {"name": "Keanu Recompile", "school": "Matrix Mainframe", "avatar": "computer", "score": 650},
            {"name": "Buzz Lightyear", "school": "Infinity & Beyond Bots", "avatar": "rocket", "score": 630},
            {"name": "Ctrl-Beyoncé-Alt", "school": "Destiny's Coders", "avatar": "alien", "score": 610},
            {"name": "Arnold Scriptnegger", "school": "I'll Be Backend", "avatar": "robot1", "score": 590}
            ]
        
        for data in initial_data:
            db_participant = Participant(**data)
            db.add(db_participant)
        
        db.commit()
    
    db.close()

# If running directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)