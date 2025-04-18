from fastapi import FastAPI

app = FastAPI()

#Define a path operation and function
@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"user_id": user_id, "name": "John Doe"}