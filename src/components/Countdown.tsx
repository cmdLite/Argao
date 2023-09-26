import React, { useState, useEffect } from "react";

interface Props {
  scheduledTime: number;
  onCountdownFinish: () => void;
}

const Countdown: React.FC<Props> = ({ scheduledTime, onCountdownFinish }) => {
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const scheduledDate = new Date(scheduledTime * 1000);
      const currentDate = new Date();
      const timeDiff = scheduledDate.getTime() - currentDate.getTime();
      if (timeDiff <= 0) {
        setTimeRemaining("Race has started");
      } else {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDiff / 1000) % 60);
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [scheduledTime, onCountdownFinish]);

  return  <span>{timeRemaining}</span>;
};

export default Countdown;