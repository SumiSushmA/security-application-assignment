import Image from "next/image";
import Link from "next/link";
const BookCard = ({ book }) => {
  // console.log(book);
  return (
    <Link href={`/books/${book?._id}`}>
      <div className="w-[364px] h-[325px] ">
        <div className="bg-[#C4C4C4] rounded-t-xl">
          <Image
            src={book?.coverImage}
            width={162}
            height={243}
            className="pt-2 mx-auto  w-[162px] h-[243px]"
            alt="book image"
          />
        </div>

        <p className="py-4 text-center text-[#000000] font-bold text-xl bg-white rounded-b-xl">
          {book?.title.length > 30
            ? `${book.title.substring(0, 30)}...`
            : book.title}
        </p>
      </div>
    </Link>
  );
};
export default BookCard;
