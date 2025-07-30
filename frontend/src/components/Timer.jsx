import { useEffect, useRef, useState } from "react";

const Timer = ({ initialMinutes, onTimerEnd, onTimeUpdate }) => {
  const [time, setTime] = useState(initialMinutes * 60);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remainingTime = initialMinutes * 60 - elapsed;

      if (remainingTime <= 0) {
        clearInterval(timerRef.current);
        setTime(0);
        onTimerEnd(initialMinutes * 60);
      } else {
        setTime(remainingTime);
        onTimeUpdate(elapsed);
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [initialMinutes, onTimerEnd, onTimeUpdate]);

  const formatTime = (seconds) => {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    secs = String(secs).padStart(2, "0");

    return `${hours}:${minutes}:${secs}`;
  };

  return (
    <div className="text-center tracking-wider text-4xl mt-10 font-bold text-[#C40031]">
      {formatTime(time)}
    </div>
  );
};

export default Timer;
