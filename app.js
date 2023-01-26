const express = require("express");
const app = express();

/* movies */
const movies = require("./models/movies");
const users = require("./models/users");

/* views */
app.set("views", __dirname + "/views");
app.set("view emngine", "ejs");
app.use(express.static(__dirname + "/views"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* api */
app.get("/movies", (req, res) => {
  const currentPage = req.query.page || 1;

  let Movies = [...movies];

  // 게시글 시간순 정렬
  Movies.sort((a, b) => {
    const prevTImestamp = new Date(a.created_at).getTime();
    const curTImestamp = new Date(b.created_at).getTime();

    return curTImestamp - prevTImestamp;
  });

  // 총 게시글 수
  const totalPostLength = Movies.length;
  // 총 페이지 수
  const totalPage = Math.ceil(totalPostLength / 10);
  // 한 그룹 당 6개 페이지 띄우기
  const pageGroup = Math.ceil(currentPage / 6);
  // 한 그룹의 마지막 페이지 번호
  let lastPage = pageGroup * 6;

  if (lastPage > totalPage) {
    lastPage = totalPage;
  }
  // 페이지를 넘어갈때
  if (totalPage < currentPage) {
    res.send({ error: "마지막 페이지입니다." });
  }
  // 한 그룹의 첫 페이지 번호
  let firstPage = lastPage - 6 + 1 <= 0 ? 1 : lastPage - 6 + 1;

  // movies.useri_d => users.name
  const moviesList = Movies.map((movie) => ({
    ...movie,
    name: users.find((user) => user.id === movie.user_id).name,
  }));

  // 게시글 나눠서 가져오기
  const paginationMovies = moviesList.splice((currentPage - 1) * 10, 10);

  res.json({
    pageInfo: {
      firstPage,
      lastPage,
      totalPage,
    },
    movies: paginationMovies,
  });
});

app.listen(5000, () => {
  console.log("5000포트에서 실행");
});
