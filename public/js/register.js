document
  .querySelector("#registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.querySelector("#username").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    try {
      const response = await axios.post("/sign/registerSuccess", {
        username: username,
        email: email,
        password: password,
      });

      console.log("회원가입 성공:", response.data);
    } catch (error) {
      console.error("회원가입 오류:", error.response.data);
    }
  });
