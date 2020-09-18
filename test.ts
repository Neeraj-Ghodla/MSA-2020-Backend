const axios = require("axios");

const url = "http://localhost:3000/";
let userID = "";
const movieID = "337401";

let testPassed = 0;

// Testing register route
const testRegister = async () => {
  console.log("Test #1: Testing Register Route");
  try {
    const { data } = await axios.post(url + "users/register", {
      username: "test",
      email: "test",
      password: "test",
    });
    const { username, email } = data;
    if (username === "test" && email === "test") {
      console.log("Register Route Test Passed");
      testPassed++;
    } else console.log("Register Route Test Failed");
  } catch (error) {
    console.log("Register Route Test Failed");
    console.log(error);
  }
};

// Testing login route
const testLogin = async () => {
  console.log("Test #2: Testing Login Route");
  try {
    const { data } = await axios.post(url + "users/login", {
      email: "test",
      password: "test",
    });
    if ("_id" in data) {
      userID = data._id;
      console.log("Login Route Test Passed");
      testPassed++;
    }
    console.log("Login Route Test Failed");
  } catch (error) {
    console.log("Login Route Test Failed");
    console.log(error);
  }
};

// Testing like route
const testLike = async () => {
  console.log("Test #3: Testing Like Route");
  try {
    const { data } = await axios.put(url + "users/liked", {
      movieID: movieID,
      userID: userID,
    });
    if (data.likedMovies.includes(movieID)) {
      console.log("Like Route Test Passed");
      testPassed++;
    } else console.log("Like Route Test Failed");
  } catch (error) {
    console.log("Like Route Test Failed");
    console.log(error);
  }
};

// Testing dislike route
const testDislike = async () => {
  console.log("Test #4: Testing Dislike Route");
  try {
    const { data } = await axios.put(url + "users/disliked", {
      movieID: movieID,
      userID: userID,
    });
    if (data.dislikedMovies.includes(movieID)) {
      console.log("Dislike Route Test Passed");
      testPassed++;
    } else console.log("Dislike Route Test Failed");
  } catch (error) {
    console.log("Dislike Route Test Failed");
    console.log(error);
  }
};

// Testing get comments route
const testGetComments = async () => {
  console.log("Test #5: Testing Get Comments Route");
  try {
    const { data } = await axios.get(url + "movie?movieID=" + movieID);

    if ("comments" in data) {
      console.log("Get Comments Route Test Passed");
      testPassed++;
    } else console.log("Get Comments Route Test Failed");
  } catch (error) {
    console.log("Get Comments Route Test Failed");
    console.log(error);
  }
};

// Testing add comment route
const testAddComment = async () => {
  console.log("Test #6: Testing Add Comment Route");
  try {
    const { data } = await axios.post(url + "movie/add", {
      movieID: movieID,
      comment: "Great Movie",
    });
    if (data.comments[data.comments.length - 1] === "Great Movie") {
      console.log("Add Comment Route Test Passed");
      testPassed++;
    } else console.log("Add Comment Route Test Failed");
  } catch (error) {
    console.log("Add Comment Route Test Failed");
    console.log(error);
  }
};

// Call all unit tests
const test = async () => {
  await testRegister();
  await testLogin();
  await testLike();
  await testDislike();
  await testGetComments();
  await testAddComment();
  // delete test user
  await axios({
    method: "delete",
    url: url + "users/delete",
    data: { userID },
  });
  console.log(`(${testPassed} / 6) test passed.`);
};

test();
