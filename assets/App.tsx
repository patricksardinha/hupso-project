import React from 'react'
import { useState } from 'react'
import './App.css'
import ListBooks from './components/ListBooks'

function App() {

  return (
    <section className='w-screen min-h-screen h-full bg-[#f1f2f6]'>
      <ListBooks></ListBooks>
    </section>
  )
}

export default App

