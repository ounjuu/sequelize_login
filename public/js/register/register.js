document
  .querySelector("#registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.querySelector("#username").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    try {
      const response = await axios.post("/sign/register", {
        username: username,
        email: email,
        password: password,
      });

      if (response.status === 200) {
        window.location.href = "/sign/registerSuccess";
      }
    } catch (error) {
      console.error("회원가입 오류:", error.response.data);
    }
  });
