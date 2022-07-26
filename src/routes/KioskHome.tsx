import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { postTakeout } from "../api";
import { orderedMenu, resultCode, stText, textProcessing } from "../atoms";
import Stt from "../components/Stt";
// import kioskStart from "../audio/kiosk_start.mp3";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #fec260;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;
const AskText = styled.span<{ isNear: boolean }>`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000000e0;
  position: absolute;
  top: 0;
  color: white;
  font-size: 20px;
  font-weight: 700;

  animation: ${(props) =>
    props.isNear
      ? "textani 1s cubic-bezier(0.55, 0.1, 0.15, 1) forwards"
      : null};
  animation-delay: 1s;
  @keyframes textani {
    50% {
      height: 100vh;
      background-color: #000000e0;
    }
    100% {
      height: 50px;
      background-color: #00000040;
    }
  }
`;

function KioskHome() {
  const setOrdered = useSetRecoilState(orderedMenu);
  const [text, setText] = useRecoilState(stText);
  const [code, setCode] = useRecoilState(resultCode);
  const setTextProcessing = useSetRecoilState(textProcessing);
  const [isNear, setIsNear] = useState(false);
  const history = useHistory();

  // const audio = new Audio(kioskStart);
  // useEffect(() => {
  //   audio.play();
  // }, []);

  //api 호출
  useEffect(() => {
    if (text && code !== 2001) {
      setTextProcessing(true);
      postTakeout(text).then((res) => {
        setTextProcessing(false);
        setCode(res.code);
        setOrdered((prev) => ({
          order: prev.order,
          price: prev.price,
          takeout: res.isTakeout,
          menu: prev.menu,
        }));
      });
    }
    // eslint-disable-next-line
  }, [text]);

  //code 확인
  useEffect(() => {
    if (code === 1001) {
      setText("");
      history.push("/processing");
    }
    // eslint-disable-next-line
  }, [code]);

  return (
    <Wrapper>
      <Stt />
      <AskText isNear={isNear} onClick={() => setIsNear(true)}>
        {isNear ? "매장에서 드시고 가시나요?" : "가까이 와주세요"}
      </AskText>
    </Wrapper>
  );
}

export default KioskHome;
