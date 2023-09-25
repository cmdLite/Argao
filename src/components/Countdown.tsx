//Component for displaying the countdown timer
import { useState, useEffect } from "react";

const Countdown: React.FC<{ scheduledTime: number }> = ({ scheduledTime }) => {
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
  }, [scheduledTime]);

  return <span>{timeRemaining}</span>;
};

export default Countdown;