from fastapi import FastAPI

app = FastAPI()

@app.get("/recommendations")
async def get_recommendations():
    return {"books": ["Book 1", "Book 2", "Book 3", "Book 4", "Book 5"]}

@app.post("/books")
async def add_book(title: str, author: str, isbn: str):
    return {"title": title, "author": author, "isbn": isbn}

@app.post("/reviews")
async def add_review(book_id: int, review: str):
    return {"book_id": book_id, "review": review}
