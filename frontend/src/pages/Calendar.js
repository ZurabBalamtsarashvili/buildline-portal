import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const CalendarHeader = ({ currentDate, onPrevMonth, onNextMonth, onToday }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-900">
        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </h2>
      <div className="flex space-x-2">
        <button
          onClick={onToday}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 
                   hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {t('calendar.today')}
        </button>
        <button
          onClick={onPrevMonth}
          className="p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 
                   focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={onNextMonth}
          className="p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 
                   focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Calendar = () => {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Sample events - in a real app, this would come from an API
  const events = [
    {
      id: 1,
      title: 'Project Kickoff',
      date: '2024-01-15',
      type: 'meeting',
      project: 'Office Complex'
    },
    {
      id: 2,
      title: 'Site Inspection',
      date: '2024-01-20',
      type: 'inspection',
      project: 'Residential Apartments'
    },
    {
      id: 3,
      title: 'Deadline: Phase 1',
      date: '2024-01-25',
      type: 'deadline',
      project: 'Shopping Mall'
    }
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDate = (date) => {
    return events.filter(event => event.date === date);
  };

  const renderCalendarDays = () => {
    const days = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Render week days
    weekDays.forEach(day => {
      days.push(
        <div key={day} className="font-semibold text-gray-900 text-center py-2">
          {day}
        </div>
      );
    });

    // Render empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="bg-gray-50" />);
    }

    // Render days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const dayEvents = getEventsForDate(dateString);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`min-h-[100px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 
                    ${isToday ? 'bg-blue-50' : ''} 
                    ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className="font-medium text-gray-900">{day}</div>
          <div className="mt-1 space-y-1">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className="px-2 py-1 text-xs rounded-full truncate"
                style={{
                  backgroundColor: event.type === 'meeting' ? '#EFF6FF' : 
                                 event.type === 'inspection' ? '#F0FDF4' : '#FEF2F2',
                  color: event.type === 'meeting' ? '#1E40AF' : 
                         event.type === 'inspection' ? '#166534' : '#991B1B'
                }}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">{t('calendar.title')}</h1>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm 
                   font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
                   focus:ring-offset-2 focus:ring-blue-500"
        >
          {t('calendar.createEvent')}
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4">
          <CalendarHeader
            currentDate={currentDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
          />
        </div>
        <div className="border-t border-gray-200">
          <div className="grid grid-cols-7 gap-px">
            {renderCalendarDays()}
          </div>
        </div>
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedDate.toLocaleDateString()}
          </h3>
          <div className="space-y-4">
            {getEventsForDate(selectedDate.toISOString().split('T')[0]).map(event => (
              <div key={event.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-2 h-2 mt-2 rounded-full ${
                    event.type === 'meeting' ? 'bg-blue-500' :
                    event.type === 'inspection' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-500">{event.project}</p>
                </div>
              </div>
            ))}
            {getEventsForDate(selectedDate.toISOString().split('T')[0]).length === 0 && (
              <p className="text-sm text-gray-500">{t('calendar.noEvents')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
