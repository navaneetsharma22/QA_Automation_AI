import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export const CustomDatePicker = ({ value, onChange, placeholder = "Select Date" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setCurrentMonth(d);
      }
    }
  }, [value, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleSelectDate = (day) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    // Format to YYYY-MM-DD local time
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - (offset*60*1000));
    onChange(localDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const renderDays = () => {
    const days = [];
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    
    // Weekday headers
    weekDays.forEach(day => {
      days.push(<div key={`header-${day}`} className="text-[11px] font-bold text-gray-500 text-center py-1">{day}</div>);
    });

    // Empty slots before first day
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-1" />);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const isSelected = value && new Date(value).getDate() === d && new Date(value).getMonth() === currentMonth.getMonth() && new Date(value).getFullYear() === currentMonth.getFullYear();
      const isToday = new Date().getDate() === d && new Date().getMonth() === currentMonth.getMonth() && new Date().getFullYear() === currentMonth.getFullYear();
      
      days.push(
        <button
          key={d}
          onClick={(e) => {
            e.stopPropagation();
            handleSelectDate(d);
          }}
          className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-medium transition-colors mx-auto
            ${isSelected ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 
              isToday ? 'bg-white/10 text-purple-300 border border-purple-500/30' : 
              'text-gray-300 hover:bg-white/10 hover:text-white'}`}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="relative cursor-pointer group"
      >
        <Calendar className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 group-hover:text-purple-400 transition-colors" />
        <div className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-300 hover:bg-white/10 group-hover:border-purple-500/50 transition-colors min-w-[140px] text-left">
          {value ? value : <span className="text-gray-500">{placeholder}</span>}
        </div>
      </div>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 p-3 bg-[#161324] border border-purple-500/30 rounded-xl shadow-xl shadow-black/40 w-[260px] animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-sm font-semibold text-gray-200">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <div className="flex gap-1">
              <button onClick={handlePrevMonth} className="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={handleNextMonth} className="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-y-1">
            {renderDays()}
          </div>
          
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
                setIsOpen(false);
              }}
              className="text-xs font-medium text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
            >
              Clear
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                const today = new Date().toISOString().split('T')[0];
                onChange(today);
                setIsOpen(false);
              }}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors px-2 py-1 rounded hover:bg-purple-500/10"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
