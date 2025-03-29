import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Bell } from "lucide-react";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emails, setEmails] = useState({ total: 0, daily: [] });
  const [contacts, setContacts] = useState({ total: 0, daily: [] });
  const [scrapingUsage, setScrapingUsage] = useState({ used: 0, total: 50 });
  const [pipelines, setPipelines] = useState({ total: 0 });
  const [meetings, setMeetings] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch emails scraped history
        const emailsResponse = await axios.get(
          "http://82.180.137.7:5000/api/history/emails",
          { headers }
        );
        const totalEmails = emailsResponse.data.reduce(
          (sum, entry) => sum + entry.count,
          0
        );
        setEmails({
          total: totalEmails,
          daily: emailsResponse.data.map((entry) => ({
            date: entry.date.split("T")[0], // Extract only the date part
            count: entry.count,
          })),
        });

        // Fetch contacts added history
        const contactsResponse = await axios.get(
          "http://82.180.137.7:5000/api/history/contacts",
          { headers }
        );
        const totalContacts = contactsResponse.data.reduce(
          (sum, entry) => sum + entry.count,
          0
        );
        setContacts({
          total: totalContacts,
          daily: contactsResponse.data.map((entry) => ({
            date: entry.date.split("T")[0], // Extract only the date part
            count: entry.count,
          })),
        });

        // Fetch scraping usage
        const scrapingResponse = await axios.get(
          "http://82.180.137.7:5000/api/dashboard/scraping-usage",
          { headers }
        );
        setScrapingUsage(scrapingResponse.data);

        // Fetch pipelines
        const pipelinesResponse = await axios.get(
          "http://82.180.137.7:5000/api/pipelines",
          { headers }
        );
        setPipelines({
          total: pipelinesResponse.data.length,
        });

        // Fetch upcoming meetings
        const meetingsResponse = await axios.get(
          "http://82.180.137.7:5000/api/meeting",
          { headers }
        );
        setMeetings(meetingsResponse.data);

        // Fetch to-do tasks
        const tasksResponse = await axios.get(
          "http://82.180.137.7:5000/api/tasks",
          { headers }
        );
        setTasks(tasksResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to generate the last 7 days with blank data
  const generateLast7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push({
        date: date.toISOString().split("T")[0], // Format as YYYY-MM-DD
        count: 0, // Default count is 0
      });
    }
    return days;
  };

  // Merge the actual data with the last 7 days to fill missing dates
  const mergeWithLast7Days = (data) => {
    const last7Days = generateLast7Days();
    const dataMap = new Map(data.map((entry) => [entry.date, entry.count]));

    return last7Days.map((day) => ({
      date: day.date,
      count: dataMap.get(day.date) || 0, // Use actual count if available, otherwise 0
    }));
  };

  const emailsLast7Days = mergeWithLast7Days(emails.daily);
  const contactsLast7Days = mergeWithLast7Days(contacts.daily);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-y-auto bg-gray-900 text-white">
      <div className="p-4 md:p-6" style={{ marginLeft: "250px" }}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <div className="flex items-center gap-4">
            <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2">
              + New Campaign
            </button>
            <button className="bg-gray-800 p-2 rounded-lg">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800/50 p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Emails Scraped</p>
                <h2 className="text-2xl font-bold">{emails.total}</h2>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <svg
                  className="h-6 w-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Scraping Usage</p>
                <h2 className="text-2xl font-bold">
                  {scrapingUsage.used}/{scrapingUsage.total}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <svg
                  className="h-6 w-6 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Contacts</p>
                <h2 className="text-2xl font-bold">{contacts.total}</h2>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <svg
                  className="h-6 w-6 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Upcoming Meetings</p>
                <h2 className="text-2xl font-bold">{meetings.length}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Emails Scraped (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={emailsLast7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Contacts Scraped (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contactsLast7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Upcoming Meetings</h3>
            <div className="space-y-4">
              {meetings.map((meeting, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{meeting.title}</h4>
                    <p className="text-sm text-gray-400">
                      {new Date(meeting.date).toLocaleDateString()} at{" "}
                      {meeting.startTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">To-Do Tasks</h3>
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg"
                >
                  <span className="font-medium">{task.title}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      task.status === "Completed"
                        ? "bg-green-500/20 text-green-400"
                        : task.status === "In Progress"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;