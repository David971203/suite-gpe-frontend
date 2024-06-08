"use client";
import React, { useEffect, useState } from 'react';

function Skeleton() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await fetch('http://localhost:8000/users'); // Ajusta la URL según sea necesario
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.error('Error fetching users:', error);
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUsers();
    }, []);
  
    const renderLoadingElements = () => {
      const elements = [];
      for (let i = 0; i < 5; i++) { // Default skeleton loading elements
        elements.push(
          <div key={i} className="flex items-center justify-between pt-4">
            <div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
          </div>
        );
      }
      return elements;
    };
  
    const renderUsers = () => {
      return users.map(user => (
        <div key={user.id} className="flex items-center justify-between pt-4">
          <div>
            <div>
            <span className='dark:text-white'>{user.nombre} {user.apellido}</span>
            </div>
            <div >
            <span className='dark:text-white'>{user.username}</span>
            </div>
          </div>
          <div >
          <span className='dark:text-white'>{user.rol.literal}</span>
          </div>
        </div>
      ));
    };
  
    return (
        <section className="bg-white dark:bg-gray-800 relative shadow-md rounded-lg mx-auto h-auto">
          <div role="status" className="w-full p-4 space-y-4 divide-y divide-gray-200  dark:divide-gray-700 md:p-6 dark:border-gray-700">
            {loading ? renderLoadingElements() : renderUsers()}
            <span className="sr-only">Loading...</span>
          </div>
        </section>
      );
  }
  
  export default Skeleton;