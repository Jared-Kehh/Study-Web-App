import React from 'react';
import { handleSelectChange } from '../utils';

interface SettingsProps {
  onStudyTimeChange: (minutes: number) => void;
  onBreakTimeChange: (minutes: number) => void;
}

const Settings: React.FC<SettingsProps> = ({
  onStudyTimeChange,
  onBreakTimeChange
}) => (
  <div className="settings">
    <div className="time-setting">
      <label>Study Time (minutes): </label>
      <select 
        onChange={(e) => handleSelectChange(e, onStudyTimeChange)}
        defaultValue="25"
      >
        <option value="15">15</option>
        <option value="25">25</option>
        <option value="30">30</option>
        <option value="45">45</option>
        <option value="60">60</option>
      </select>
    </div>
    
    <div className="time-setting">
      <label>Break Time (minutes): </label>
      <select 
        onChange={(e) => handleSelectChange(e, onBreakTimeChange)}
        defaultValue="5"
      >
        <option value="3">3</option>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
      </select>
    </div>
  </div>
);

export default Settings;