import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import BadgeTag from "./BadgeTag";
import Filters from "./Filters";
import DetailedView from "./DetailView";

const ListBooks = () => {

  const [listBooks, setListBooks] = useState<any>([]);
  const [filters, setFilters] = useState<any>([]);
  const dateOptions : object = { year: "numeric", month: "long"};
  const [detailedView, setDetailedView] = useState<boolean>(false);
  const [currentBook, setCurrentBook] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    axios.get(`/api/list_all_book`)
      .then((response) => {
        const data = response.data;
        setListBooks(data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.code);
        }
      });
  }, []);

  useEffect(() => {
    axios.get(`/api/list_book?filters=${JSON.stringify(filters)}`)
      .then((response) => {
        const data = response.data;
        setListBooks(data);
        //setTimeout(() => console.log("loading"),5000);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.code);
        }
      });
  }, [filters]);

  const handleDetailView = (book) => {
    setDetailedView(true);
    setCurrentBook(book);
  }
	
  return (
    <>
    {detailedView ? 
      <DetailedView book={currentBook} setDetailedView={setDetailedView}></DetailedView> 
    :
      <>
      {isLoading ?
      <>
        <Filters setFilters={setFilters}></Filters>
        <ol className="flex flex-col items-center">
          {listBooks.length > 0 ? listBooks.map((book) => (
            <li key={book.id} className="center mt-6 items-center">
              <div onClick={() => handleDetailView(book)} className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 cursor-pointer">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">{book.title} - {book.author}</h5>
                <h2 className="mb-2 text-md font-bold">{new Date(book.publishedAt).toLocaleDateString("en-US", dateOptions)}</h2>
                <BadgeTag tag={book.category}></BadgeTag>
              </div>
            </li>
          )) : <div className="center mt-6 font-bold text-red-500">No books found !</div>}
        </ol>
      </>
      : <div>loading</div>
      }
      </>
    }
    </>
  );
}

export default ListBooks