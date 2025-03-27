from fastapi import FastAPI

app = FastAPI()

#Define a path operation and function
@app.get("/") #This decorator connects the root path / with a GET request
async def root(): #The function that handles requests to path /
    return {"message": "Hello World"} #Return a JSON response


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)