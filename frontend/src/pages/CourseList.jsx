import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "@/api/lms";

const CourseList = () => {

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {

    try {

      const data = await getCourses();

      setCourses(data || []);

    } catch (err) {

      console.error(err);

    }

  }

  return (

<div className="p-4">

<h1 className="text-xl font-bold mb-4">
Training Courses
</h1>

{courses.length === 0 && (
<p>No training available</p>
)}

<div className="space-y-4">

{courses.map((course) => (

<Link
key={course.name}
to={`/training/${course.name}`}
className="block border rounded p-4 hover:bg-gray-50"
>

<h2 className="font-semibold">
{course.title || course.course_title}
</h2>

<div
className="text-sm text-gray-600"
dangerouslySetInnerHTML={{
__html: course.description || ""
}}
/>

</Link>

))}

</div>

</div>

  );

};

export default CourseList;