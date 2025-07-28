"use client";
import ApiRequest from "@/utils/apiRequest";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [categories, setCategories] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const parsedToken = JSON.parse(storedToken);
          setToken(parsedToken);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing token from localStorage", error);
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      }
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const res = await ApiRequest.get("/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res?.data?.data?.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser({});
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUser();
      fetchCategories();
      fetchQuizzes();
      fetchQuestions();
    }
  }, [token, isAuthenticated]);

  const fetchCategories = async () => {
    try {
      const response = await ApiRequest.get("/category");
      setCategories(response?.data?.data?.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await ApiRequest.get("/quiz");
      setQuizzes(response?.data?.data?.quizs || []);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await ApiRequest.get("/question");
      setQuestions(response?.data?.data?.questions || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const addCategory = (newCategory) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  const addQuiz = (newQuiz) => {
    setQuizzes((prevQuizzes) => [...prevQuizzes, newQuiz]);
  };

  const addQuestion = (newQuestion) => {
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        loading,
        setLoading,
        token,
        setToken,
        categories,
        fetchCategories,
        addCategory,
        quizzes,
        fetchQuizzes,
        addQuiz,
        questions,
        fetchQuestions,
        addQuestion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
