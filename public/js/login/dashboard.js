document
  .getElementById("createRoomBtn")
  .addEventListener("click", async function (e) {
    const roomName = document.getElementById("roomName").value.trim();

    if (!roomName) {
      alert("채팅방 이름을 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post("/chat/createRoom", { name: roomName });

      if (response.status === 200) {
        alert("채팅방이 생성되었습니다.");
        window.location.reload(); // 채팅방 목록을 갱신
      }
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
      alert("채팅방 생성 중 오류가 발생했습니다.");
    }
  });
