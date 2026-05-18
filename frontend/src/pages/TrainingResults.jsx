import { useEffect, useState } from "react";
import { getTrainingResults } from "../api/lms";

export default function TrainingResults(){

  const [data,setData] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    load();
  },[]);

  async function load(){

    try{

      const res = await getTrainingResults();

      setData(res || []);

    }catch(err){

      console.error(err);
      alert("Failed to load results");

    }finally{

      setLoading(false);

    }

  }

  if(loading){
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (

<div className="p-4 max-w-2xl mx-auto">

<h1 className="text-xl font-bold mb-6 text-center">
Training Results
</h1>

<div className="space-y-4">

{data.map((r)=>{

const color = r.passed
  ? "text-green-600"
  : "text-red-600";

const badge = r.passed
  ? "bg-green-100 text-green-700"
  : "bg-red-100 text-red-700";

return (

<div
key={r.name}
className="border rounded-xl p-4 bg-white shadow-sm"
>

<div className="flex justify-between items-start">

<div>

<div className="font-semibold text-lg">
{r.quiz}
</div>

<div className="text-sm text-gray-500">
Course: {r.course}
</div>

</div>

<div className={`px-3 py-1 text-sm rounded-full ${badge}`}>
{r.passed ? "PASSED" : "FAILED"}
</div>

</div>

<div className="mt-4 flex justify-between items-center">

<div className={`text-2xl font-bold ${color}`}>
{Math.round(r.score)}%
</div>

<div className="text-sm text-gray-500">
Attempt: {r.attempt_count || 1}
</div>

</div>

</div>

);

})}

{data.length === 0 && (

<div className="text-center text-gray-500">
No training results yet
</div>

)}

</div>

</div>

  );

}