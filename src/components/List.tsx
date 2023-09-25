import React,{useEffect} from "react";
import { useAppSelector, RootState, useAppDispatch } from "../store/store";
import { selectNextToGo, fetchData } from "../store/features/dataSlice";
import Countdown from "./Countdown";


const List = () => {
    const dispatch = useAppDispatch();
  const data = useAppSelector((state: RootState) => selectNextToGo(state));

  const [categoryFilter, setCategoryFilter] = React.useState<string | null>(null);

  const raceSummaries = data.raceSummaries ? Object.values(data.raceSummaries) : [];

  console.log(data);

  const now = new Date().getTime() / 1000;

  const sortedRaceSummaries = raceSummaries
    .filter((raceSummary) => raceSummary.advertised_start.seconds + 60 > now)
    .sort((a, b) => {
      const aTime = a.advertised_start.seconds;
      const bTime = b.advertised_start.seconds;
      return aTime - bTime;
    });

  const advertisedStart = (time: number): React.ReactNode => {
    const date = new Date(time * 1000);
    return <span>{date.toLocaleTimeString()}</span>;
  };

  const handleCategoryFilter = (categoryId: string | null) => {
    setCategoryFilter(categoryId);
  };

  
  const filteredRaceSummaries = categoryFilter
    ? sortedRaceSummaries.filter((raceSummary) => raceSummary.category_id === categoryFilter)
    : sortedRaceSummaries;

  const paddedRaceSummaries = filteredRaceSummaries ? Object.values(filteredRaceSummaries).slice(0,5) : [];

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(fetchData());
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

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

  <table className="rounded-md w-1/2 mb-20">
    <thead>
      <tr className="bg-gradient-to-b from-sky-400 to-sky-600 text-white">
        <th className="p-2 border rounded">Meeting Name</th>
        <th className="p-2 border rounded">Race Number</th>
        <th className="p-2 border rounded">Countdown Timer</th>
        <th className="p-2 border rounded">Time Schedule</th>
      </tr>
    </thead>
    {paddedRaceSummaries.length > 0 ? (
    <tbody>
      {paddedRaceSummaries.map((raceSummary, index) => (
        <tr key={index} 
        className="race-summary" 
        data-advertised-start-seconds={raceSummary.advertised_start?.seconds || 0}>
          <td className="p-2 border rounded">{raceSummary.meeting_name}</td>
          <td className="p-2 border rounded text-center">{raceSummary.race_number}</td>
          <td className="p-2 border rounded text-center"><Countdown scheduledTime={raceSummary.advertised_start.seconds} /></td>
          <td className="p-2 border rounded text-center">{advertisedStart(raceSummary.advertised_start?.seconds || 0)}</td>
        </tr>
      ))}
    </tbody>
  
) : (
    <tbody>
    <tr className="h-24">
      <td className="border p-2 text-center" colSpan={3}>
        No data available.
      </td>
    </tr>
  </tbody>
)
}
</table>
  </div>
  );
};

export default List;