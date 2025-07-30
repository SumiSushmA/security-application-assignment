"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PropagateLoader from "react-spinners/PropagateLoader";
import ApiRequest from "@/utils/apiRequest";
import Link from "next/link";

const NewsDetail = () => {
  const [newsDetail, setNewsDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const formattedDate = new Date(newsDetail?.createdAt).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const fetchNewsDetails = async () => {
    try {
      setLoading(true);
      const res = await ApiRequest.get(`/news/${id}`);
      setNewsDetail(res?.data?.data?.singleNews);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching news detail", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsDetails();
  }, [id]);

  return (
    <div className="w-full px-5 mx-auto mb-8 mt-14 max-w-7xl md:px-10">
      {loading ? (
        <div className="flex items-center justify-center h-[50%]">
          <PropagateLoader color="#0eb1a6" loading={loading} size={20} />
        </div>
      ) : (
        <>
          <Link href="/news" className="text-[#454D55] md:text-xl">
            News &gt; {newsDetail.title}
          </Link>
          <h1 className="mt-7 md:mt-14 text-[#000000] text-2xl md:text-6xl font-bold">
            {newsDetail?.title}
          </h1>
          <div className="mt-10 md:mt-20 bg-slate-400 rounded-xl">
            <Image
              src={newsDetail?.coverImage}
              width={1280}
              height={400}
              alt="news image"
              className="object-top object-fill rounded-t-xl max-h-[400px]"
            />
            <div className="px-4 bg-white rounded-b-xl">
              <p className="text-[#454D55] md:text-lg pt-1 md:pt-3">
                {formattedDate}
              </p>
              <p
                className="text-[#454D55] md:text-xl mt-4 md:mt-8 pb-6"
                style={{ whiteSpace: "pre-line" }}>
                {newsDetail?.description}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NewsDetail;
