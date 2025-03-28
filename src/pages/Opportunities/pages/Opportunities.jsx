import React, { useState, useEffect } from 'react';
import { PlusCircle, Grid } from 'lucide-react';
import StageCard from '../components/StageCard';
import NewOpportunityModal from '../components/NewOpportunityModal';
import axios from 'axios';

function Opportunities() {
  const [pipelines, setPipelines] = useState([]); // Fetch pipelines from API
  const [selectedPipeline, setSelectedPipeline] = useState('');
  const [opportunities, setOpportunities] = useState({}); // Pre-fetched opportunities for all stages
  const [selectedStage, setSelectedStage] = useState(null); // Selected stage
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState({
    name: '',
    description: '',
    value: 0,
    stage: '',
  });

  // Fetch pipelines from the backend
  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get('http://82.180.137.7:5000/api/pipelines', { headers });
        setPipelines(response.data);
        if (response.data.length > 0) {
          setSelectedPipeline(response.data[0].name); // Set the first pipeline as selected by default
        }
      } catch (error) {
        console.error('Error fetching pipelines:', error);
      }
    };

    fetchPipelines();
  }, []);

  // Pre-fetch opportunities for all stages when a pipeline is selected
  useEffect(() => {
    const fetchOpportunities = async () => {
      if (!selectedPipeline) return;

      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const headers = { Authorization: `Bearer ${token}` };

        const pipeline = pipelines.find((p) => p.name === selectedPipeline);
        if (!pipeline) return;

        const opportunitiesByStage = {};

        // Fetch opportunities for each stage in the selected pipeline
        await Promise.all(
          pipeline.stages.map(async (stage) => {
            const response = await axios.get(
              `http://82.180.137.7:5000/api/opportunities/${pipeline._id}/${stage._id}/opportunities`,
              { headers }
            );
            opportunitiesByStage[stage._id] = response.data;
          })
        );

        setOpportunities(opportunitiesByStage); // Store all opportunities in state
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      }
    };

    fetchOpportunities();
  }, [selectedPipeline, pipelines]);

  // Handle opening the "Add Opportunity" modal
  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  // Handle closing the "Add Opportunity" modal
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewOpportunity({
      name: '',
      description: '',
      value: 0,
      stage: '',
    });
  };

  // Handle input changes in the modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOpportunity({
      ...newOpportunity,
      [name]: value,
    });
  };

  // Handle adding a new opportunity
  const handleAddOpportunity = async () => {
    if (!newOpportunity.name.trim() || !newOpportunity.stage.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const headers = { Authorization: `Bearer ${token}` };

      // Find the pipelineId and stageId based on the selected pipeline and stage
      const pipeline = pipelines.find((p) => p.name === selectedPipeline);
      if (!pipeline) {
        alert('Pipeline not found.');
        return;
      }

      const stage = pipeline.stages.find((s) => s.name === newOpportunity.stage);
      if (!stage) {
        alert('Stage not found in the selected pipeline.');
        return;
      }

      const pipelineId = pipeline._id;
      const stageId = stage._id;

      // Make the POST request to create the opportunity
      const response = await axios.post(
        `http://82.180.137.7:5000/api/opportunities/${pipelineId}/${stageId}/opportunities`,
        {
          title: newOpportunity.name, // Opportunity title
          description: newOpportunity.description || '', // Optional description
          value: newOpportunity.value || 0, // Opportunity value
          status: 'Open', // Default status
        },
        { headers }
      );

      // Update the opportunities list for the specific stage
      setOpportunities((prev) => ({
        ...prev,
        [stageId]: [...(prev[stageId] || []), response.data],
      }));
      handleCloseAddModal(); // Close the modal after successful creation
    } catch (error) {
      console.error('Error creating opportunity:', error);
      alert('Failed to create opportunity. Please try again.');
    }
  };

  // Handle selecting a stage
  const handleStageClick = (stageId) => {
    setSelectedStage(stageId === selectedStage ? null : stageId); // Toggle stage selection
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full md:w-auto">
          <select
            className="w-full md:w-64 bg-[#2a2a2a] border border-red-900/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
            value={selectedPipeline}
            onChange={(e) => setSelectedPipeline(e.target.value)}
          >
            {pipelines.map((pipeline) => (
              <option key={pipeline._id} value={pipeline.name}>
                {pipeline.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg hover:bg-red-900/50 transition">
            <Grid className="h-5 w-5 text-red-500" />
          </button>
          <button
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            onClick={handleOpenAddModal}
          >
            <PlusCircle className="h-5 w-5" />
            <span className="hidden md:inline">Add opportunity</span>
            <span className="md:hidden">Add</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pipelines
          .find((p) => p.name === selectedPipeline)
          ?.stages.map((stage) => (
            <StageCard
              key={stage._id}
              stage={stage}
              opportunities={opportunities[stage._id] || []}
              onClick={() => handleStageClick(stage._id)}
            />
          ))}
      </div>

      {showAddModal && (
        <NewOpportunityModal
          onClose={handleCloseAddModal}
          onSubmit={handleAddOpportunity}
          opportunity={newOpportunity}
          onInputChange={handleInputChange}
          stages={pipelines.find((p) => p.name === selectedPipeline)?.stages || []}
        />
      )}
    </div>
  );
}

export default Opportunities;