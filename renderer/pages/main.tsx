import {
  Box,
  Button,
  Step,
  StepButton,
  Stepper,
  Typography,
} from "@mui/material";
import { useState } from "react";

import InviteSnackbar from "../components/common/InviteSnackbar";

const steps: string[] = [
  "메인 화면",
  "유저 리스트",
  "참여중인 채팅방 리스트",
  "오픈 채팅방 리스트",
  "채팅방 내부",
];

const stepContents: string[] = [
  `안녕하세요 만나 뵙게되어서 영광입니다. :) LET's CHAT 채팅을 이용해주셔서 감사합니다. 프로그램 이용에 앞서
  채팅 프로그램의 메뉴에 대해서 설명하겠습니다. 좌측 상단의 메뉴 바에서 메뉴를 만나 보실 수 있습니다.`,

  `유저 리스트 화면에서는 가입한 회원들을 보실 수 있습니다.
  \n회원들을 채팅방으로 초대하여 대화를 할 수도 있습니다.
  'GROUP' 기능을 이용하여 한번에 여러 회원들을 초대할 수도 있으며
  '1:1 CHAT' 기능을 이용하여 한명만 초대 할 수 있습니다.
  \n방이 생성되면 화면 왼쪽 아래에 알람이 뜨며 클릭시에는 방으로 이동합니다.
  \n이 알람은 직접 방을 만들 때에도 나타나지만 누군가가 여러분을 초대할 때에도 나타납니다.`,
  `참여중인 채팅방 리스트에서는 여러분이 참여중인 방만을 볼 수 있습니다.
  \n초대 알람을 통해 방에 들어가지 못했더라도 이 공간에서 방에 접근 가능합니다.
  \n파란색 방들은 생성된지 5분이 지난 방들이고 초록색 방들은 생성된지 5분이 되지않은 방들입니다.
  \n만약 초록색 방을 보시게 된다면 누군가가 여러분을 초대한지 5분이 되지 않았다는 의미입니다.
  \n누군가 여러분을 초대한다면 실시간으로 새로운 방이 생성됩니다.`,

  `오픈 채팅방은 관리자가 만들어 놓은 테마 채팅방입니다. LET's CHAT 에 가입해주신 모든 회원 분들에게
  열려있는 공간이며 모두가 들어올 수 있고 편하게 채팅할 수 있습니다. 오픈 채팅방은 알람 기능이 따로 없습니다.
  원하는 테마를 골라서 채팅해 보세요!`,

  `채팅방 안에서는 상단에서 현재 보고 있는 채팅방의 제목과 참여자들을 볼 수 있습니다.
  채팅방에서는 알람기능이 작동하지 않으니 불편함 없이 편하게 채팅을 즐겨주시면 됩니다.`,
];

/**
 *
 * @description 로그인시에 처음으로 접근하는 메인 화면입니다. 프로그램의 사용법에 대해 설명합니다.
 */
const Main: React.FunctionComponent = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleNext = () => {
    const newActiveStep = activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  return (
    <>
      <Box
        sx={{
          width: "50%",
          height: "50%",
          textAlign: "start",
          position: "absolute",
          top: "50%",
          left: "25%",
        }}
      >
        <Stepper alternativeLabel activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepButton color="inherit" onClick={handleStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
          {stepContents[activeStep]}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button
            onClick={handleNext}
            sx={{ mr: 1 }}
            disabled={activeStep === steps.length - 1}
          >
            Next
          </Button>
        </Box>
      </Box>
      <InviteSnackbar />
    </>
  );
};

export default Main;
