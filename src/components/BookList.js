// React component for Book List
import React from 'react';

const BookList = () => {
  const books = [
    { id: 1, title: '1984', author: 'George Orwell' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
    { id: 3, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' }
  ];

  return (
    <ul className="list-disc pl-5">
      {books.map(book => (
        <li key={book.id} className="mb-2">
          <span className="font-semibold">{book.title}</span> by {book.author}
        </li>
      ))}
    </ul>
  );
};

export default BookList;