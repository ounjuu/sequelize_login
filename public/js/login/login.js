document.querySelector("#loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  try {
    const response = await axios.post("/login/loginpost", {
      email: email,
      password: password,
    });

    if (response.data.success) {
      window.location.href = "/login/dashboard";
    } else {
      alert("로그인 실패: " + response.data.message);
    }
  } catch (error) {
    console.error("로그인 오류:", error.response.data);
  }
});
