import Image from "next/image";
import Link from "next/link";
const ExamSetCard = ({ quiz }) => {
  return (
    quiz?.questions?.length > 0 && (
      <Link href={`/exam/${quiz._id}`}>
        <div className="rounded-xl w-[365px]  ">
          <Image
            src={quiz.coverImage}
            width={365}
            height={325}
            alt="setImage"
            className="border-x-2 border-t-2 rounded-t-xl border-gray-400 w-[365px] h-[269px] object-cover"
          />
          <p className="py-3 text-lg font-bold text-center text-black bg-white rounded-b-xl">
            {quiz.title}
          </p>
        </div>
      </Link>
    )
  );
};
export default ExamSetCard;
