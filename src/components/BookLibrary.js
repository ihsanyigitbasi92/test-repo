// React component for Book Library
import React from 'react';
import BookList from './BookList';

const BookLibrary = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Smart Book Library</h1>
      <BookList />
    </div>
  );
};

export default BookLibrary;