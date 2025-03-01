const allDivWrap = document.querySelector(".allDivWrap");
allDivWrap.innerHTML = `<div>
<h2>KIKIPOPO에 오신 것을 환영합니다!</h2>
<div>
  <p>회원가입</p>
  <p>KIKIPOPO의 회원이 되어보세요!</p>
  <button onclick="signBtn()">회원가입</button>
</div>
<div>
  <p>로그인</p>
  <p>로그인 후 이용해주세요!</p>
  <button onclick="loginBtn()">로그인</button>
</div>
</div>`;

const signBtn = () => {
  window.location.assign("/sign/register/");
};

const loginBtn = () => {
  window.location.assign("/login/main/");
};
