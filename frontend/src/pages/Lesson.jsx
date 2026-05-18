import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLesson } from "../api/lms";

export default function Lesson() {

const { lesson } = useParams();

const [lessonData, setLessonData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
loadLesson();
}, [lesson]);

async function loadLesson() {
try {
const data = await getLesson(lesson);
setLessonData(data);
} catch (err) {
console.error(err);
} finally {
setLoading(false);
}
}

if (loading) {
return <div className="p-4">Loading lesson...</div>;
}

if (!lessonData) {
return <div className="p-4">Lesson not found</div>;
}

return ( <div className="p-4">

  <h1 className="text-xl font-bold mb-4">
    {lessonData.lesson_title}
  </h1>

  {lessonData.lesson_type === "Video" && lessonData.video_url && (
    <div className="mb-6">
      <iframe
        src={lessonData.video_url}
        className="w-full h-64 rounded"
        allowFullScreen
      />
    </div>
  )}

  {lessonData.attachment && (
    <div className="mb-4">
      <a
        href={lessonData.attachment}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline"
      >
        Download Attachment
      </a>
    </div>
  )}

  {lessonData.content && (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{
        __html: lessonData.content
      }}
    />
  )}

</div>

);
}
