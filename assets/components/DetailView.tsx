import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import BadgeTag from "./BadgeTag";


const DetailedView = (props: any) => {
  const dateOptions : object = { year: "numeric", month: "long", day: "numeric"};
  const [askEmail, setAskEmail] = useState<boolean>(true);
  const currentBookId = props.book.id;
  const [currentUser, setCurrentUser] = useState<string>("");
  const [bookingInfo, setBookingInfo] = useState<any>([]);
  const [bookIsAvailable, setBookIsAvailable] = useState<boolean>(true);
  const [dateError, setDateError] = useState<boolean>(false);
  const [successBooking, setSuccessBooking] = useState<boolean>(false);
  const [userVerified, setUserVerified] = useState<boolean>(false);
  const [bookedStart, setBookedStart] = useState<any>("");
  const [bookedEnd, setBookedEnd] = useState<any>("");
  const [successDelete, setSuccessDelete] = useState<boolean>(false);

  useEffect(() => {
    axios.get(`/api/booking_info/${currentBookId}`)
      .then((response) => {
        const data = response.data;
        if (response.status == 200) {
          setBookIsAvailable(true);
          setBookingInfo(data);
        }
        else {
          setBookIsAvailable(false);
        }
      })
      .catch((error) => {
        if (error.response) {
          setBookIsAvailable(false);
        }
      });
  }, []);

  
  const handleAskEmail = (event) => {
    event.preventDefault();

    if (!bookIsAvailable) {
      axios.get(`/api/user_booking_id/${currentBookId}`)
      .then((response) => {
        const data = response.data;
        setBookedStart(JSON.parse(data)[0].start.slice(0, 10));
        setBookedEnd(JSON.parse(data)[0].end.slice(0, 10));
        
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.code);
        }
      });

      axios.get(`/api/user_booking_email/${event.target.form.email.value}`)
      .then((response) => {
        const data = response.data;        
        if (JSON.parse(data)[0].user === event.target.form.email.value) {
          setUserVerified(true);
        }         
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.code);
        }
      });
    }
    setCurrentUser(event.target.form.email.value);
    setAskEmail(false);
  };


  const handleBooking = (event) => {
    event.preventDefault();    
    var dateStart = "";
    var dateEnd = "";

    if (!isNaN(event.target.form.dateStart.valueAsNumber)) {
      dateStart = event.target.form.dateStart.valueAsNumber;
    }
    if (!isNaN(event.target.form.dateEnd.valueAsNumber)) {
      dateEnd = event.target.form.dateEnd.valueAsNumber;
    }
    
    if (dateStart != "" && dateEnd != "" && dateStart <= dateEnd) {
      setDateError(false);
      let infos = {
        "user" : currentUser,
        "start": new Date(dateStart).toLocaleDateString("sv-SE"),
        "end": new Date(dateEnd).toLocaleDateString("sv-SE"),
        "status": "active",
        "book_id": props.book.id
      };
    
      axios.post("/api/new_booking", JSON.stringify(infos))
          .then((response) => {
              setSuccessBooking(true);
          })
          .catch((error) => {
              if (error.response) {
                  console.log(error.code);
              }
          });
    } else {
      setDateError(true);
    }
  }

  const handleDelete = (event) => {
    event.preventDefault();
    axios.delete(`/api/delete_booking/${currentBookId}`)
          .then((response) => {
              setSuccessDelete(true);
              setBookIsAvailable(true);
          })
          .catch((error) => {
              if (error.response) {
                  console.log(error.code);
              }
          });
  }

  return (
    <div className="flex flex-col item-center">
      <button type="button" onClick={() => props.setDetailedView(false)} className="max-w-10 mt-6 ml-6 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 rounded-full text-sm font-bold px-4 py-2.5">X</button>
      <div className="flex flex-col items-center">
        <div className="center mt-6 block max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow cursor-pointer">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">{props.book.title} - {props.book.author}</h5>
          <h2 className="mb-2 text-md font-bold">{new Date(props.book.publishedAt).toLocaleDateString("en-US", dateOptions)}</h2>
          <BadgeTag tag={props.book.category}></BadgeTag>
          <p className="mt-2 font-normal text-gray-700">{props.book.description}</p>
          {askEmail ? 
              <div className="flex flex-col mt-4">
                <form>
                  <label htmlFor="email" className=" text-sm font-bold">Please enter your email to book</label>
                  <div className="flex flex-row mt-4 gap-3">
                    <input type="text" id="email" placeholder="hi.example@gmail.com" className="block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                    <button type="button" onClick={handleAskEmail} className=" max-h-1/4 active:scale-95 rounded-lg bg-blue-600 px-8 py-2 font-medium text-white outline-none focus:ring hover:opacity-90">Send</button>
                  </div>
                </form>
              </div>
          :
          <>
            {bookIsAvailable ?
            <>
              {!successBooking &&
                <div className="mt-6 font-bold text-green-500">Your book is available !</div>
              }
              {!successBooking ?
              <form>
                <div className="flex flex-col">
                  <label htmlFor="dateStart" className="mt-4 text-sm font-bold">Please enter a start date for your reservation</label>
                  <input type="date" id="dateStart" className="mt-2 block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="dateEnd" className="mt-4 text-sm font-bold">Please enter an end date for your reservation</label>
                  <input type="date" id="dateEnd" className="mt-2 block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                </div>
                {dateError && (
                    <div className="mt-6 font-bold text-red-500">Please input valid dates</div>
                  )
                }
                  <button type="button" onClick={handleBooking} className="mt-6 w-5/6 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 rounded-lg text-xl font-bold px-5 py-2.5 me-2 my-2">Book it now</button>
                </form>
                :
                <div className="mt-6 font-bold text-green-500">Booking successful !</div>
              }
            </>
              : 
              <>{userVerified ?
                <>
                  <div className="mt-6 font-bold text-red-500">You have already reserved this book from {bookedStart} to {bookedEnd}!</div>
                  <button onClick={handleDelete} type="button" className="mt-6 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ">Delete</button>
                </>
                :
                <div className="mt-6 font-bold text-red-500">Sorry, your book is not available from {bookedStart} to {bookedEnd}!</div>
              }
            </>
            }
          </>
          }
        </div>
      </div>
    </div>
  );
}

export default DetailedView