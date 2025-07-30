"use client";

import HomepageBeforeLogin from "@/components/HomepageBeforeLogin";
import HomepageAfterLogin from "@/components/HomepageAfterLogin";
import { useAuth } from "@/context/userContext";

const Page = () => {
  const { isAuthenticated, user } = useAuth();
  // console.log(isAuthenticated, user);

  return (
    <div>
      {isAuthenticated && user ? (
        <HomepageAfterLogin />
      ) : (
        <HomepageBeforeLogin />
      )}
    </div>
  );
};

export default Page;
