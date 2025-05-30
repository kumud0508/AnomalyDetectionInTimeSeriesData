import * as React from "react";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const Slider: React.FC<SliderProps> = ({ value, onChange, min = 0, max = 100, step = 1 }) => {
  return (
    <div className="w-full">
      <input
        type="range"
        className="w-full cursor-pointer accent-blue-600"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="text-sm text-gray-600 mt-1 text-center">
        {value}
      </div>
    </div>
  );
};

export default Slider;