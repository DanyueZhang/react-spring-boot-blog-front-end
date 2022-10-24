import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./components/admin/Admin";
import Home from "./components/main/Home";
import Main from "./components/main/Main";
import About from "./components/main/About";
import Categories from "./components/main/Categories";
import Posts from "./components/admin/Posts";
import Editor from "./components/admin/Editor";
import Login from "./components/admin/Login";
import Tags from "./components/admin/Tags";
import Article from "./components/main/Article";
import Comment from "./components/admin/Comment";
import AboutEditor from "./components/admin/AboutEditor";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route path="" element={<Home />} />
          <Route path="categories/:tagId" element={<Categories />} />
          <Route path="about" element={<About />} />
          <Route path="article/:articleId" element={<Article />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />}>
          <Route path="posts" element={<Posts />} />
          <Route path="tags" element={<Tags />} />
          <Route path="editor/:id" element={<Editor />} />
          <Route path="comments" element={<Comment />} />
          <Route path="about" element={<AboutEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
