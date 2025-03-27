from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()
class Item(BaseModel):
    name: str
    price: float

@app.post("/items", response_model=Item)
def create_item(item: Item):
    return {"message": f"Item {item.name} created with price {item.price}"}