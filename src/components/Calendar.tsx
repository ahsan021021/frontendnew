import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addWeeks, startOfWeek, endOfWeek, addDays, isSameDay, parseISO, parse } from 'date-fns';

interface Event {
  id: string;
  title: string;
  date: string; // ISO string format
  time: string;
  email: string;
  color: string;
  description?: string;
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'Month' | 'Week' | 'Day'>('Month');
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Team Meeting',
      date: '2024-03-20',
      time: '10:00 AM',
      email: 'team@example.com',
      color: 'bg-blue-500',
      description: 'Weekly team sync'
    },
    {
      id: '2',
      title: 'Project Review',
      date: '2024-03-22',
      time: '2:00 PM',
      email: 'project@example.com',
      color: 'bg-purple-500',
      description: 'Q1 project review'
    }
  ]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    email: '',
    color: 'bg-blue-500',
    description: ''
  });

  const getDaysForView = () => {
    switch (view) {
      case 'Month':
        return eachDayOfInterval({
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        });
      case 'Week':
        return eachDayOfInterval({
          start: startOfWeek(currentDate),
          end: endOfWeek(currentDate)
        });
      case 'Day':
        return [currentDate];
      default:
        return [];
    }
  };

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(parseISO(event.date), day));
  };

  const navigatePrevious = () => {
    switch (view) {
      case 'Month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'Week':
        setCurrentDate(addWeeks(currentDate, -1));
        break;
      case 'Day':
        setCurrentDate(addDays(currentDate, -1));
        break;
    }
  };

  const navigateNext = () => {
    switch (view) {
      case 'Month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'Week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'Day':
        setCurrentDate(addDays(currentDate, 1));
        break;
    }
  };

  const formatTimeForDisplay = (timeString: string) => {
    try {
      // Handle 24-hour format input
      if (timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
        return format(date, 'h:mm a');
      }
      // Handle already formatted time
      return timeString;
    } catch (error) {
      return timeString;
    }
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.time && newEvent.email && newEvent.date) {
      const formattedTime = formatTimeForDisplay(newEvent.time);
      
      if (editingEventId) {
        // Update existing event
        setEvents(events.map(event => 
          event.id === editingEventId ? {
            ...newEvent,
            id: editingEventId,
            time: formattedTime
          } : event
        ));
      } else {
        // Add new event
        setEvents([
          ...events,
          {
            id: Math.random().toString(36).substr(2, 9),
            ...newEvent,
            time: formattedTime
          }
        ]);
      }

      // Reset form
      setNewEvent({
        title: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: format(new Date(), 'HH:mm'),
        email: '',
        color: 'bg-blue-500',
        description: ''
      });
      setEditingEventId(null);
      setShowEventModal(false);
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const handleViewEvent = (event: Event) => {
    alert(`
      Event Details:
      Title: ${event.title}
      Date: ${format(parseISO(event.date), 'MMMM d, yyyy')}
      Time: ${event.time}
      Email: ${event.email}
      Description: ${event.description || 'No description provided'}
    `);
  };

  const handleEditEvent = (event: Event) => {
    // Convert 12-hour format to 24-hour format for the time input
    const time24 = parse(event.time, 'h:mm a', new Date());
    
    setNewEvent({
      title: event.title,
      date: event.date,
      time: format(time24, 'HH:mm'),
      email: event.email,
      color: event.color,
      description: event.description || ''
    });
    setEditingEventId(event.id);
    setShowEventModal(true);
  };

  const days = getDaysForView();

  return (
    <div className="flex-1 p-2 md:p-6 bg-gray-900">
      <div className="bg-gray-800 rounded-xl shadow-lg p-3 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl md:text-2xl font-semibold text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={navigatePrevious}
                className="p-2 hover:bg-gray-700 rounded-full text-gray-300"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={navigateNext}
                className="p-2 hover:bg-gray-700 rounded-full text-gray-300"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex bg-gray-700 rounded-lg p-1 w-full md:w-auto">
              {['Month', 'Week', 'Day'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v as 'Month' | 'Week' | 'Day')}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium ${
                    view === v
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => setShowEventModal(true)}
              className="w-full md:w-auto flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              <span>Add Event</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="grid grid-cols-7 gap-px bg-gray-700">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="bg-gray-800 py-2 text-center text-sm font-medium text-gray-400"
                >
                  {day}
                </div>
              ))}
              
              {days.map((day) => {
                const dayEvents = getEventsForDay(day);
                return (
                  <div
                    key={day.toString()}
                    className={`relative bg-gray-800 min-h-[100px] md:min-h-[120px] p-2 ${
                      !isSameMonth(day, currentDate)
                        ? 'bg-gray-900 text-gray-600'
                        : ''
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center h-6 w-6 rounded-full ${
                        isToday(day)
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300'
                      }`}
                    >
                      {format(day, 'd')}
                    </div>
                    
                    <div className="mt-2 space-y-1">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className={`${event.color} text-white text-xs p-1 rounded truncate cursor-pointer`}
                          onClick={() => handleViewEvent(event)}
                        >
                          {event.time} - {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors space-y-2 md:space-y-0"
            >
              <div className="flex items-center space-x-4">
                <div className={`h-3 w-3 rounded-full ${event.color}`} />
                <div>
                  <h4 className="font-medium text-white">{event.title}</h4>
                  <p className="text-sm text-gray-400">
                    {format(parseISO(event.date), 'MMM d, yyyy')} at {event.time}
                  </p>
                  <p className="text-sm text-gray-400">{event.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2">
                <button 
                  onClick={() => handleViewEvent(event)}
                  className="text-gray-400 hover:text-white"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleEditEvent(event)}
                  className="text-gray-400 hover:text-white"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleDeleteEvent(event.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingEventId ? 'Edit Event' : 'Add New Event'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Time</label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={newEvent.email}
                  onChange={(e) => setNewEvent({...newEvent, email: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="example@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Color</label>
                <select
                  value={newEvent.color}
                  onChange={(e) => setNewEvent({...newEvent, color: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="bg-blue-500">Blue</option>
                  <option value="bg-purple-500">Purple</option>
                  <option value="bg-green-500">Green</option>
                  <option value="bg-red-500">Red</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    setEditingEventId(null);
                    setNewEvent({
                      title: '',
                      date: format(new Date(), 'yyyy-MM-dd'),
                      time: format(new Date(), 'HH:mm'),
                      email: '',
                      color: 'bg-blue-500',
                      description: ''
                    });
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEvent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingEventId ? 'Update Event' : 'Add Event'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;