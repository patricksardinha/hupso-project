import axios from "axios";
import React from "react";

const Filters = (props: any) => {

  const handleSearch = (event) => {
    event.preventDefault();
    props.setFilters(prevState => ({
      ...prevState,
      ["title"]: event.target.form.title.value,
      ["category"]: event.target.form.category.value,
      ["publication"]: event.target.form.publication.value,
    }));
  };

  const handleReset = (event) => {
    event.preventDefault();
    event.target.form.title.value = "";
    event.target.form.category.value = "";
    event.target.form.publication.value = "";
  };

  return (
    <form>
      <div className="flex w-full sm:w-1/2 lg:w-1/4 relative lg:fixed pl-4 pt-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
          <h2 className="text-stone-700 text-xl font-bold">Apply filters</h2>
          <p className="mt-1 text-sm">Use filters to find your books.</p>
          <div className="mt-6 gap-6">
            <div className="flex flex-col">
              <label htmlFor="title" className="text-sm font-bold">Title</label>
              <input type="text" id="title" placeholder="Doloremque id sunt" className="mt-2 block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
            </div>

            <div className="flex flex-col mt-4">
              <label htmlFor="category" className="text-sm font-bold">Category</label>
              <input type="text" id="category" placeholder="quasi" className="mt-2 block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
            </div>

            <div className="flex flex-col mt-4">
              <label htmlFor="publication" className="text-sm font-bold">Publication Year</label>
              <input type="text" id="publication" placeholder="2006" className="mt-2 block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
            </div>
          </div>

          <div className="mt-8 w-full justify-end space-x-4 md:flex">
            <button type="button" onClick={handleReset} className="active:scale-95 rounded-lg bg-gray-200 px-8 py-2 font-medium text-gray-600 outline-none focus:ring hover:opacity-90">Reset</button>
            <button type="button" onClick={handleSearch} className="active:scale-95 rounded-lg bg-blue-600 px-8 py-2 font-medium text-white outline-none focus:ring hover:opacity-90">Search</button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Filters


