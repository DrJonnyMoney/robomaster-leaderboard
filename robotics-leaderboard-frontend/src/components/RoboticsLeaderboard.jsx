import React, { useState, useEffect } from 'react';
import { User, ChevronUp, ChevronDown, Award, School, Trophy, CircuitBoard, RefreshCw, Trash2, Clock } from 'lucide-react';

// API URL - change this to your backend URL
const API_URL = 'http://localhost:8000';

// Available cartoon avatars
const AVATARS = [
  { id: 'robot1', emoji: '🤖', name: 'Robot' },
  { id: 'rocket', emoji: '🚀', name: 'Rocket' },
  { id: 'scientist', emoji: '🧑‍🔬', name: 'Scientist' },
  { id: 'alien', emoji: '👽', name: 'Alien' },
  { id: 'computer', emoji: '💻', name: 'Computer' },
  { id: 'gear', emoji: '⚙️', name: 'Gear' },
  { id: 'robot2', emoji: '🦾', name: 'Robotic Arm' },
  { id: 'satellite', emoji: '🛰️', name: 'Satellite' }
];

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

const RoboticsLeaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    school: '',
    avatar: 'robot1',
    score: 0
  });
  const [scrollPosition, setScrollPosition] = useState(0);

  // Fetch participants from API
  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/participants/`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setLeaders(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching participants:', err);
      setError('Failed to load leaderboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Load participants on component mount
  useEffect(() => {
    fetchParticipants();
  }, []);

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle input changes for new participant form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewParticipant({
      ...newParticipant,
      [name]: value
    });
  };

  // Add new participant
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newParticipant.name || !newParticipant.school) {
      alert('Please fill out all fields');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/participants/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newParticipant),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Refresh participant list
      await fetchParticipants();
      
      // Reset form
      setNewParticipant({
        name: '',
        school: '',
        avatar: 'robot1',
        score: 0
      });
      
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding participant:', err);
      alert('Failed to add new challenger. Please try again.');
    }
  };
  
  // Delete a participant
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this participant?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/participants/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Refresh participant list
      await fetchParticipants();
    } catch (err) {
      console.error('Error deleting participant:', err);
      alert('Failed to delete participant. Please try again.');
    }
  };

  // Get medal for top 3 participants
  const getMedal = (index) => {
    if (index === 0) return <Trophy className="text-yellow-600" />;
    if (index === 1) return <Trophy className="text-gray-500" />;
    if (index === 2) return <Trophy className="text-cyan-700" />;
    return null;
  };

  // Get avatar emoji by ID
  const getAvatarEmoji = (avatarId) => {
    const avatar = AVATARS.find(a => a.id === avatarId);
    return avatar ? avatar.emoji : '🤖';
  };

  return (
    <div className="min-h-screen text-gray-800 font-sans relative" style={{ fontFamily: "'Audiowide', sans-serif" }}>
      {/* Background with parallax effect - with limits */}
  {/* Background with parallax effect */}
  <div
  className="fixed inset-0 z-0 overflow-hidden"
  style={{
    backgroundImage: "url('/images/planet.png')",
    backgroundSize: "100% auto", // This preserves the aspect ratio
    backgroundPosition: `center calc(50% + ${scrollPosition * 0.30}px)`,
    backgroundRepeat: "no-repeat",
    opacity: 0.8
  }}
></div>
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
  <header className="text-center mb-8">
    {/* Neon title effect - keeping this exactly as is */}
    <h1 className="text-4xl md:text-5xl font-black mb-6 relative">
      <span className="neon-text">ROBOMASTER RUSH & FIND</span>
    </h1>
    
    {/* Enhanced glitch text effect with yellow for Leaderboard */}
    <div className="relative my-4 mx-auto inline-block">
      {/* Base white text */}
      <p className="text-4xl md:text-5xl tracking-wider font-black relative z-10">
        LEADERBOARD
      </p>
      
      {/* Cyan glitch layer */}
      <p className="text-4xl md:text-5xl tracking-wider font-black absolute top-0 left-0 cyan-glitch" aria-hidden="true">
        LEADERBOARD
      </p>
      
      {/* Magenta glitch layer */}
      <p className="text-4xl md:text-5xl tracking-wider font-black absolute top-0 left-0 magenta-glitch" aria-hidden="true">
        LEADERBOARD
      </p>
      
      {/* Yellow glitch layer */}
      <p className="text-4xl md:text-5xl tracking-wider font-black absolute top-0 left-0 yellow-glitch" aria-hidden="true">
        LEADERBOARD
      </p>
    </div>
    
    {/* CSS for animations and effects */}
    <style jsx>{`
      .neon-text {
        color: #fff;
        text-shadow: 
          0 0 5px #0ff,
          0 0 10px #0ff, 
          0 0 20px #0ff, 
          0 0 40px #0080ff, 
          0 0 80px #0080ff,
          0 0 90px #0080ff;
        animation: pulsate 2.5s infinite alternate;
      }
      
      .cyan-glitch {
        color: #0ff;
        clip-path: inset(15% 0 40% 0);
        animation: glitch-anim-1 4s infinite linear alternate-reverse;
        transform: translateX(-2px);
        opacity: 0.7;
      }
      
      .magenta-glitch {
        color: #f0f;
        clip-path: inset(40% 0 20% 0);
        animation: glitch-anim-2 3s infinite linear alternate-reverse;
        transform: translateX(2px);
        opacity: 0.7;
      }
      
      .yellow-glitch {
        color: #ff0;
        clip-path: inset(60% 0 0% 0);
        animation: glitch-anim-3 2.5s infinite linear alternate-reverse;
        transform: translateX(1px);
        opacity: 0.7;
      }
      
      @keyframes pulsate {
        0% {
          text-shadow: 
            0 0 5px #0ff,
            0 0 10px #0ff, 
            0 0 20px #0ff, 
            0 0 40px #0080ff, 
            0 0 80px #0080ff;
        }
        100% {
          text-shadow: 
            0 0 5px #0ff,
            0 0 10px #0ff, 
            0 0 20px #0ff, 
            0 0 40px #0080ff, 
            0 0 80px #0080ff,
            0 0 100px #0080ff,
            0 0 150px #0080ff;
        }
      }
      
      @keyframes glitch-anim-1 {
        0%, 100% { 
          clip-path: inset(15% 0 40% 0);
          transform: translate(-2px, 0); 
        }
        20% { 
          clip-path: inset(25% 0 50% 0);
          transform: translate(-1px, 1px); 
        }
        40% { 
          clip-path: inset(5% 0 60% 0);
          transform: translate(-3px, -1px); 
        }
        60% { 
          clip-path: inset(35% 0 20% 0);
          transform: translate(-2px, 2px); 
        }
        80% { 
          clip-path: inset(10% 0 55% 0);
          transform: translate(-1px, -2px); 
        }
      }
      
      @keyframes glitch-anim-2 {
        0%, 100% { 
          clip-path: inset(40% 0 20% 0);
          transform: translate(2px, 0); 
        }
        20% { 
          clip-path: inset(30% 0 30% 0);
          transform: translate(1px, 1px); 
        }
        40% { 
          clip-path: inset(50% 0 10% 0);
          transform: translate(3px, -1px); 
        }
        60% { 
          clip-path: inset(20% 0 40% 0);
          transform: translate(0px, 2px); 
        }
        80% { 
          clip-path: inset(45% 0 15% 0);
          transform: translate(2px, -2px); 
        }
      }
      
      @keyframes glitch-anim-3 {
        0%, 100% { 
          clip-path: inset(60% 0 0% 0);
          transform: translate(1px, 0); 
        }
        20% { 
          clip-path: inset(70% 0 5% 0);
          transform: translate(-1px, -1px); 
        }
        40% { 
          clip-path: inset(65% 0 15% 0);
          transform: translate(1px, 1px); 
        }
        60% { 
          clip-path: inset(50% 0 5% 0);
          transform: translate(0px, 0); 
        }
        80% { 
          clip-path: inset(80% 0 10% 0);
          transform: translate(2px, -1px); 
        }
      }
    `}</style>
          
          <div className="flex justify-center space-x-4 mt-6">
            {!showAddForm && (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-all flex items-center"
                onClick={() => setShowAddForm(true)}
              >
                <User className="mr-2 h-5 w-5" />
                Add New Challenger
              </button>
            )}
            
            <button
              className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-full transition-all flex items-center"
              onClick={fetchParticipants}
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded text-red-700">
              {error}
            </div>
          )}
        </header>
        
        {/* Add Participant Form */}
        {showAddForm && (
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mb-8 border border-blue-300">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
              <CircuitBoard className="mr-2 text-blue-500" /> New Challenger
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newParticipant.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-gray-800"
                  placeholder="Enter team name"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">School</label>
                <input
                  type="text"
                  name="school"
                  value={newParticipant.school}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-gray-800"
                  placeholder="Enter school name"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Score</label>
                <input
                  type="number"
                  name="score"
                  value={newParticipant.score}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-gray-800"
                  placeholder="Enter score"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Choose Avatar</label>
                <div className="grid grid-cols-4 gap-2">
                  {AVATARS.map((avatar) => (
                    <div
                      key={avatar.id}
                      className={`cursor-pointer text-center p-2 rounded ${
                        newParticipant.avatar === avatar.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                      onClick={() => setNewParticipant({ ...newParticipant, avatar: avatar.id })}
                    >
                      <div className="text-2xl">{avatar.emoji}</div>
                      <div className="text-xs mt-1">{avatar.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-1/2"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full w-1/2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="bg-white bg-opacity-95 rounded-lg shadow-lg overflow-hidden border border-blue-300">
  {loading && leaders.length === 0 ? (
    <div className="py-12 text-center">
      <div className="mx-auto w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-2xl text-gray-600">Loading leaderboard data...</p>
    </div>
  ) : leaders.length === 0 ? (
    <div className="py-12 text-center">
      <p className="text-2xl text-gray-600 mb-4">No participants yet.</p>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-all text-xl"
        onClick={() => setShowAddForm(true)}
      >
        Add Your First Challenger
      </button>
    </div>
  ) : (
    <table className="w-full">
      <thead>
        <tr className="bg-blue-100">
          <th className="py-4 px-6 text-left text-gray-700 text-xl">Rank</th>
          <th className="py-4 px-6 text-left text-gray-700 text-xl">Name</th>
          <th className="py-4 px-6 text-left text-gray-700 text-xl">
            <div className="flex items-center">
              <School className="mr-2 h-6 w-6 text-gray-700" />
              School
            </div>
          </th>
          <th className="py-4 px-6 text-right text-gray-700 text-xl">
            <div className="flex items-center justify-end">
              <Clock className="mr-2 h-6 w-6 text-gray-700" />
              Time
            </div>
          </th>
          <th className="py-4 px-6 text-center text-gray-700 text-xl">Actions</th>
        </tr>
      </thead>
      <tbody>
        {leaders
          // Sort by time (lowest first)
          .sort((a, b) => a.score - b.score)
          .slice(0, 15)
          .map((leader, index) => (
            <tr
              key={leader.id}
              className={`border-b border-gray-200 ${
                index < 3 ? 'bg-blue-50' : ''
              } hover:bg-gray-100 transition-colors`}
            >
              <td className="py-5 px-6">
                <div className="flex items-center">
                  <span className="font-bold mr-2 text-2xl text-gray-800">{index + 1}</span>
                  {getMedal(index)}
                </div>
              </td>
              <td className="py-5 px-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-3xl mr-4">
                    {getAvatarEmoji(leader.avatar)}
                  </div>
                  <span className="font-medium text-xl text-gray-800">{leader.name}</span>
                </div>
              </td>
              <td className="py-5 px-6 text-xl text-gray-600">{leader.school}</td>
              <td className="py-5 px-6 text-right font-bold text-xl text-blue-600">
                {formatTime(leader.score)}
              </td>
              <td className="py-5 px-6 text-center">
                <button
                  className="text-gray-500 hover:text-red-600 transition-colors"
                  onClick={() => handleDelete(leader.id)}
                  title="Delete"
                >
                  <Trash2 className="h-7 w-7" />
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  )}
</div>
        <footer className="mt-8 text-center text-gray-600 text-sm">
          <p>© 2025 ITE Robomaster Rush & Find Challenge</p>
        </footer>
      </div>
    </div>
  );
};

export default RoboticsLeaderboard;