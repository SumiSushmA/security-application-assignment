// // frontend/src/app/exam/page.jsx
// "use client";

// import ApiRequest from "@/utils/apiRequest";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// export default function ExamListPage() {
//   const [exams, setExams] = useState([]);

//   useEffect(() => {
//     // ApiRequest.get("/quiz")
//     ApiRequest.get(`/quiz?cacheBust=${Date.now()}`)
//       .then((res) => {
//         console.log("API /quiz response:", res.data);
//         // your API returns { data: { quizzes: [...] } }
//         setExams(res.data.data.quizs  || []);   // ← update this line
//         // setExams(res.data.data.quizzes || []);
//       })
//       .catch((err) => console.error("Failed to fetch exams", err));
//   }, []);

//   return (
//     <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
//       <h1>Available Exams</h1>
//       {exams.length === 0 ? (
//         <p>No exams available right now.</p>
//       ) : (
//         <ul style={{ listStyle: "none", padding: 0 }}>
//           {exams.map((exam) => (
//             <li
//               key={exam._id}
//               style={{
//                 border: "1px solid #ddd",
//                 borderRadius: "8px",
//                 padding: "1rem",
//                 marginBottom: "1rem",
//               }}
//             >
//               <h2>{exam.title}</h2>
//               <p>{exam.description}</p>
//               <Link href={`/exam/${exam._id}`}>
//                 <button style={{ padding: "0.5rem 1rem" }}>
//                   Start Exam
//                 </button>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
// frontend/src/app/exam/page.jsx
"use client";

import ApiRequest from "@/utils/apiRequest";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ExamListPage() {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    ApiRequest.get(`/quiz?cacheBust=${Date.now()}`)
      .then((res) => {
        setExams(res.data.data.quizs || []);
      })
      .catch((err) => console.error("Failed to fetch exams", err));
  }, []);

  return (
    <div className="py-12 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Available Exams</h1>

      {exams.length === 0 ? (
        <p className="text-gray-600">No exams available right now.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
            >
              {exam.coverImage && (
                <img
                  src={exam.coverImage}
                  alt={exam.title}
                  className="h-40 w-full object-cover"
                />
              )}
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-xl font-semibold mb-2">{exam.title}</h2>
                <p className="text-gray-700 flex-1">{exam.description}</p>
                <Link href={`/exam/${exam._id}`}>
                  <button className="mt-4 inline-block bg-green-600 text-white font-medium py-2 px-4 rounded hover:bg-green-700 transition">
                    Start Exam
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
