import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizResult } from "../api/lms";

export default function QuizResult(){

  const { quiz } = useParams();
  const navigate = useNavigate();

  const [data,setData] = useState(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    loadResult();
  },[quiz]);

  async function loadResult(){

    try{

      const res = await getQuizResult(quiz);
      setData(res);

    }catch(err){

      console.error(err);
      alert("Failed to load result");

    }finally{

      setLoading(false);

    }

  }

  function getStatusColor(){

    if(!data) return "text-gray-600";

    return data.passed
      ? "text-green-600"
      : "text-red-600";

  }

  if(loading){
    return <div className="p-6 text-center">Loading result...</div>;
  }

  if(!data){
    return <div className="p-6 text-center">Result not found</div>;
  }

  return (

<div className="max-w-xl mx-auto p-6">

<h1 className="text-2xl font-bold text-center mb-6">
Quiz Result
</h1>

<div className="border rounded-xl p-6 shadow bg-white">

<div className="text-center mb-6">

<div className="text-4xl font-bold mb-2">
{data.score || 0}%
</div>

<div className={`text-xl font-semibold ${getStatusColor()}`}>
{data.passed ? "PASSED 🎉" : "FAILED"}
</div>

</div>

<div className="space-y-2 text-sm text-gray-600">

<div>
<b>Course :</b> {data.course}
</div>

<div>
<b>Quiz :</b> {data.quiz}
</div>

<div>
<b>Started :</b> {data.start_time}
</div>

</div>

<div className="mt-8 space-y-3">

<button
onClick={()=>navigate(`/training/${data.course}`)}
className="w-full bg-blue-600 text-white py-2 rounded-lg"
>
Back to Course
</button>

{!data.passed && (

<button
onClick={()=>navigate(`/quiz/${data.quiz}`)}
className="w-full bg-red-600 text-white py-2 rounded-lg"
>
Retry Quiz
</button>

)}

</div>

</div>

</div>

  );

}