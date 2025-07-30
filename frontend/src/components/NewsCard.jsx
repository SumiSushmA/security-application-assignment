import Image from "next/image";
import Link from "next/link";
const NewsCard = ({ news }) => {
  // console.log(news);
  const formattedDate = new Date(news?.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-[1140px] max-h-[528px] pb-6">
      <div className=" bg-slate-400 rounded-t-xl">
        <Image
          src={news?.coverImage}
          width={1140}
          height={269}
          alt="News Image"
          className="object-fill md:object-cover object-top  rounded-t-xl max-h-[269px]"
        />
      </div>
      <div className="px-4 bg-white rounded-b-xl">
        <p className="text-[#454D55] md:text-lg pt-1 md:pt-3 ">
          {formattedDate}
        </p>
        <h1 className="text-[#000000] font-bold text-xl md:text-4xl mt-4 md:mt-8">
          {news?.title}
        </h1>
        <p className="text-[#454D55] md:text-xl mt-4 md:mt-8  ">
          {news?.description.length > 400
            ? `${news?.description.substring(0, 200)} . . . `
            : news?.description}
        </p>
        <Link href={`news/${news?._id}`}>
          <button className="my-4 bg-[#063173] hover:bg-[#00225c] duration-300 text-white font-bold px-7 py-3 rounded-xl">
            Read More
          </button>
        </Link>
      </div>
    </div>
  );
};
export default NewsCard;
