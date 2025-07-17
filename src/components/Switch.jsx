import './Switch.css';
import { useState } from 'react';

export default function Switch() {
  const [isChecked, setIsChecked] = useState(true);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (!isChecked) { 
        document.documentElement.classList.remove('dark');
    }
    else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <label className="switch-container">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className="sr-only"
      />
      <div className={`switch-track ${isChecked ? 'switch-checked' : ''}`}>
        <div className={`switch-thumb ${isChecked ? 'switch-thumb-checked' : ''}`}>
          {isChecked ? (
            <img src="/images/light-mode.png" alt="Light Mode" className="switch-icon" />
          ) : (
            <img src="/images/dark-mode.png" alt="Dark Mode" className="switch-icon" />
          )}
        </div>
      </div>
    </label>
  );
}