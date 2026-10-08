from fastapi import FastAPI

app = FastAPI(title="Gourmand API")


@app.get("/health")
def health():
    return {"status": "ok"}