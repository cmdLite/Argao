import React, { useState, useEffect } from "react";
import { useAppSelector, RootState } from "../store/store";
import { selectRaceSummaries, selectDataStatus } from "../store/features/dataSlice";
import Countdown from "./Countdown";

const List = () => {
  const data = useAppSelector((state: RootState) => selectRaceSummaries(state));
  const status = useAppSelector((state: RootState) => selectDataStatus(state));
  console.log("Data",data);
  console.log("Status",status);

  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [raceSummaries, setRaceSummaries] = useState(data ? Object.values(data) : []);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  let now = new Date().getTime() / 1000;

  const sortedRaceSummaries = raceSummaries
    .filter((raceSummary) => raceSummary.advertised_start.seconds + 60 > now)
    .sort((a, b) => {
      const aTime = a.advertised_start.seconds;
      const bTime = b.advertised_start.seconds;
      return aTime - bTime;
    });

  useEffect(() => {
    setRaceSummaries(data ? Object.values(data) : []);
    setTimeout(()=> setIsLoading(false), 2000)
  }, [data]);

  useEffect(() => {
    const intervalId = setInterval(() => { 
      setRaceSummaries((prevRaceSummaries) => {
        const updatedRaceSummaries = prevRaceSummaries.filter((raceSummary) => {
          const raceStartTime = raceSummary.advertised_start.seconds;
          const timeDiff = raceStartTime - now;
          return timeDiff > -60;
        });
        return updatedRaceSummaries;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [now,raceSummaries]);

  const handleCategoryFilter = (categoryId: string | null) => {
    setIsLoading(true);
    setCategoryFilter(categoryId);
    setTimeout(()=> setIsLoading(false), 2000)
  };

  const filteredRaceSummaries = categoryFilter
    ? sortedRaceSummaries.filter((raceSummary) => raceSummary.category_id === categoryFilter)
    : sortedRaceSummaries;

  const paddedRaceSummaries = filteredRaceSummaries.slice(0, 5);

  return (
    <div className="rounded-md shadow border m-2 p-2 flex flex-col items-center">
    <p className="text-5xl m-10">Next to go</p>
    <p className="text-2xl">Filter by category</p>
    <div className="flex justify-center m-5">
      <button
        className={`mr-2 px-4 py-2 rounded-md ${
          categoryFilter === "9daef0d7-bf3c-4f50-921d-8e818c60fe61" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
        }`}
        onClick={() => handleCategoryFilter("9daef0d7-bf3c-4f50-921d-8e818c60fe61")}
      >
       Greyhound racing
      </button>
      <button
        className={`mr-2 px-4 py-2 rounded-md ${
          categoryFilter === "161d9be2-e909-4326-8c2c-35ed71fb460b" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
        }`}
        onClick={() => handleCategoryFilter("161d9be2-e909-4326-8c2c-35ed71fb460b")}
      >
        Harness racing
      </button>
      <button
        className={`mr-2 px-4 py-2 rounded-md ${
          categoryFilter === "4a2788f8-e825-4d36-9894-efd4baf1cfae" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
        }`}
        onClick={() => handleCategoryFilter("4a2788f8-e825-4d36-9894-efd4baf1cfae")}
      >
        Horse racing
      </button>
      <button
        className={`px-4 py-2 rounded-md ${
          categoryFilter === null ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
        }`}
        onClick={() => handleCategoryFilter(null)}
      >
        All
      </button>
    </div>
      <table className="table-auto w-1/2 mb-20">
        <thead>
        <tr className="bg-gradient-to-b from-sky-400 to-sky-600 text-white">
        <th className="p-2 border rounded">Meeting Name</th>
        <th className="p-2 border rounded">Race Number</th>
        <th className="p-2 border rounded">Countdown Timer</th>
          </tr>
        </thead>
        <tbody>
          {paddedRaceSummaries.map((raceSummary, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{raceSummary.race_name}</td>
              <td className="border px-4 py-2">
                {raceSummary.race_number}
              </td>
              <td className="border px-4 py-2">
                {isLoading ? "Loading..." : 
                <Countdown
                  scheduledTime={raceSummary.advertised_start.seconds}
                  onCountdownFinish={() => {
                    setRaceSummaries((prevRaceSummaries) =>
                      prevRaceSummaries.filter((prevRaceSummary) => prevRaceSummary.id !== raceSummary.id)
                    );
                  }}
                />
                }
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;