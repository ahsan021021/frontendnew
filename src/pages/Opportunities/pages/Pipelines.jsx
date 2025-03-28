import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import NewPipelineModal from '../components/NewPipelineModal';
import axios from 'axios';

function Pipelines() {
  const [pipelines, setPipelines] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [newPipeline, setNewPipeline] = useState({
    name: '',
    stages: [{ id: Date.now(), name: '', color: '#6366f1' }],
    visibleInFunnel: true,
    visibleInPie: true,
  });

  // Fetch pipelines from the backend
  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get('http://82.180.137.7:5000/api/pipelines', { headers });
        setPipelines(response.data);
      } catch (error) {
        console.error('Error fetching pipelines:', error);
      }
    };

    fetchPipelines();
  }, []);

  // Add a new stage to the pipeline
  const handleAddStage = () => {
    setNewPipeline({
      ...newPipeline,
      stages: [...newPipeline.stages, { id: Date.now(), name: '', color: '#6366f1' }],
    });
  };

  // Remove a stage from the pipeline
  const handleRemoveStage = (stageId) => {
    setNewPipeline({
      ...newPipeline,
      stages: newPipeline.stages.filter((stage) => stage.id !== stageId),
    });
  };

  // Update a stage's name or color
  const handleStageChange = (stageId, field, value) => {
    setNewPipeline({
      ...newPipeline,
      stages: newPipeline.stages.map((stage) =>
        stage.id === stageId ? { ...stage, [field]: value } : stage
      ),
    });
  };

  // Create a new pipeline
  const handleAddPipeline = async () => {
    if (newPipeline.name.trim() && newPipeline.stages.every((stage) => stage.name.trim())) {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const headers = { Authorization: `Bearer ${token}` };

        // Format the stages data correctly
        const formattedStages = newPipeline.stages.map((stage) => ({
          name: stage.name.trim(),
          color: stage.color,
        }));

        // Prepare the payload
        const payload = {
          name: newPipeline.name.trim(),
          stages: formattedStages,
          visibleInFunnel: newPipeline.visibleInFunnel,
          visibleInPie: newPipeline.visibleInPie,
        };

        // Send the POST request to create a new pipeline
        const response = await axios.post('http://82.180.137.7:5000/api/pipelines', payload, { headers });

        // Update the pipelines state with the new pipeline
        setPipelines([...pipelines, response.data]);

        // Reset the form and close the modal
        setNewPipeline({
          name: '',
          stages: [{ id: Date.now(), name: '', color: '#6366f1' }],
          visibleInFunnel: true,
          visibleInPie: true,
        });
        setShowAddModal(false);
      } catch (error) {
        console.error('Error creating pipeline:', error);
      }
    }
  };

  // Edit a pipeline's name
  const handleEditPipeline = async (_id, newName) => {
    if (!_id) {
      console.error('Pipeline ID is missing');
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const headers = { Authorization: `Bearer ${token}` };

      const updatedPipeline = { ...pipelines.find((p) => p._id === _id), name: newName };
      await axios.put(`http://82.180.137.7:5000/api/pipelines/${_id}`, updatedPipeline, { headers });
      setPipelines(pipelines.map((pipeline) => (pipeline._id === _id ? updatedPipeline : pipeline)));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating pipeline:', error);
    }
  };

  // Delete a pipeline
  const handleDeletePipeline = async (_id) => {
    if (!_id) {
      console.error('Pipeline ID is missing');
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const headers = { Authorization: `Bearer ${token}` };

      await axios.delete(`http://82.180.137.7:5000/api/pipelines/${_id}`, { headers });
      setPipelines(pipelines.filter((pipeline) => pipeline._id !== _id));
    } catch (error) {
      console.error('Error deleting pipeline:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Pipelines</h2>
        <button
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition w-full md:w-auto justify-center"
          onClick={() => setShowAddModal(true)}
        >
          <PlusCircle className="h-5 w-5" />
          <span>Create new pipeline</span>
        </button>
      </div>

      <div className="bg-[#2a2a2a] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/50">
              <tr>
                <th className="text-left px-4 md:px-6 py-4">NAME</th>
                <th className="text-left px-4 md:px-6 py-4">STAGES</th>
                <th className="text-right px-4 md:px-6 py-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {pipelines.map((pipeline) => (
                <tr key={pipeline._id} className="border-t border-red-900/20">
                  <td className="px-4 md:px-6 py-4">
                    {editingId === pipeline._id ? (
                      <input
                        type="text"
                        defaultValue={pipeline.name}
                        onBlur={(e) => handleEditPipeline(pipeline._id, e.target.value)}
                        className="bg-[#2a2a2a] border border-red-900/50 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-red-500"
                      />
                    ) : (
                      <span>{pipeline.name}</span>
                    )}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {pipeline.stages.map((stage) => (
                        <span
                          key={stage._id}
                          className="px-3 py-1 rounded-full text-sm"
                          style={{ backgroundColor: `${stage.color}20`, color: stage.color }}
                        >
                          {stage.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="p-2 hover:bg-red-500/20 rounded-lg transition"
                        onClick={() => setEditingId(pipeline._id)}
                      >
                        <Pencil className="h-5 w-5 text-red-500" />
                      </button>
                      <button
                        className="p-2 hover:bg-red-500/20 rounded-lg transition"
                        onClick={() => handleDeletePipeline(pipeline._id)}
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <NewPipelineModal
          onClose={() => setShowAddModal(false)}
          pipeline={newPipeline}
          onAddStage={handleAddStage}
          onRemoveStage={handleRemoveStage}
          onStageChange={handleStageChange}
          onSubmit={handleAddPipeline}
        />
      )}
    </div>
  );
}

export default Pipelines;