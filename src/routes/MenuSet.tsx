import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { postSet } from "../api";
import {
  orderedMenu,
  processing,
  procIdx,
  progressBarLevel,
  resultCode,
  stText,
  textProcessing,
} from "../atoms";
import MenuCard from "../components/MenuCard";
import menuData from "../menu-table.json";
import { idToName, makeMenu } from "../utils";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 0 50px;
  position: relative;
`;
const Header = styled.div`
  width: 90%;
  height: 100px;
  background: linear-gradient(90deg, #f65858, #e64848);
  border: 3px solid white;
  border-top: none;
  border-bottom-right-radius: 30px;
  border-bottom-left-radius: 30px;
  display: flex;
  align-items: center;
  padding-left: 30px;
  margin-left: -3px;
  color: white;
  font-size: 24px;
  font-weight: 700;
  position: absolute;
  top: 0;
  z-index: 1;
`;

function MenuSet() {
  const [ordered, setOrdered] = useRecoilState(orderedMenu);
  const [processIdx, setProcessIdx] = useRecoilState(procIdx);
  const setIsProcessing = useSetRecoilState(processing);
  const [option, setOption] = useState<number[]>(
    processIdx < ordered.menu.length ? ordered.menu[processIdx].set : []
  );
  const [text, setText] = useRecoilState(stText);
  const [code, setCode] = useRecoilState(resultCode);
  const setTextProcessing = useSetRecoilState(textProcessing);
  const [progress, setProgress] = useRecoilState(progressBarLevel);
  const history = useHistory();

  //progressBar 계산
  useEffect(() => {
    if (progress.passConflict) {
      setProgress({
        value: 0.75,
        passConflict: false,
        stage: "set",
        progress: "3/4",
      });
    } else {
      setProgress({
        value: 0.67,
        passConflict: false,
        stage: "set",
        progress: "2/3",
      });
    }
    // eslint-disable-next-line
  }, []);

  //api 호출
  useEffect(() => {
    if (text) {
      setTextProcessing(true);
      if (code === 2005 || code === 1002 || code === 2007) {
        //code 2005: 세트변경
        postSet(text, [...option]).then((res) => {
          setIsProcessing(false);
          setTextProcessing(false);
          setCode(res.code);
          setOption(res.set);
        });
      } else {
        setTextProcessing(false);
      }
    }
    // eslint-disable-next-line
  }, [text]);

  //code 확인
  useEffect(() => {
    if (code === 2006) {
      //code 2006: 세트완료
      //TODO: 다음으로 넘기기
      const newMenu = makeMenu(ordered.menu, processIdx, "SET", option);
      setOrdered((prev) => ({
        order: prev.order,
        price: prev.price,
        takeout: prev.takeout,
        menu: newMenu,
      }));
      setProcessIdx((prev) => prev + 1);
      setIsProcessing(false);
      setText("");
      setCode(1001);
      history.push("/processing");
    }
    if (code === 2007) {
      //code 2007: 세트충돌
      //TODO: 세트 충돌 알려주기 ex. 콜라, 사이다
    }
    // eslint-disable-next-line
  }, [code]);

  return (
    <Wrapper>
      <Header>
        "
        {idToName(
          menuData,
          ordered.menu[processIdx] ? ordered.menu[processIdx].id[0] : 0
        )}
        " 에 대한 세트 메뉴를 선택해주세요!
      </Header>
      <MenuCard
        name={
          option[0] === 0
            ? "사이드를 말해주세요"
            : idToName(menuData, Number(option[0]))
        }
        index={0}
        id={option[0]}
      />
      <MenuCard
        name={
          option[1] === 0
            ? "음료를 말해주세요"
            : idToName(menuData, Number(option[1]))
        }
        index={0}
        id={option[1]}
      />
    </Wrapper>
  );
}

export default MenuSet;
