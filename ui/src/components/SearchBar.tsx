import React, { ChangeEvent, useState } from 'react';

interface SearchBarProps {
    onSearch: (searchQuery: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchQuery(value);
        onSearch(value);
    };

    return (
       <div className="mb-5">
           <h2 className="mb-2 text-white">Поиск системы</h2>
           <div className="relative">
               <svg className="w-4 h-4 absolute left-2.5 top-3.5 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                         d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
               </svg>
               <input
                   type="text"
                   className="p-2 pl-8 text-white border border-gray-700 bg-gray-700 focus:outline-none focus:border-active"
                   value={searchQuery}
                   onChange={handleInputChange}
                   placeholder="Asabona"
               />
           </div>
       </div>
    );
};

export default SearchBar;