from fastapi.responses import JSONResponse
from fastapi import FastAPI

app = FastAPI()

@app.get("/items/")
async def create_item(name:str):
    return JSONResponse(status_code=201, content={"message": "Items created.", "name": name})
