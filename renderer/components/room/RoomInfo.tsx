import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import { Iuser } from "../../type/user";
import { Iroom } from "../../type/room";

type RoomInfo = {
  members: Iuser[];
  roomInfo: Iroom;
};

/**
 *
 * @description 방 내부에서 방의 제목과 참여자 정보를 담고있는 컴포넌트입니다.
 */
const RoomInfo: React.FunctionComponent<RoomInfo> = ({ members, roomInfo }) => {
  return (
    <>
      <Accordion
        disabled={!members}
        sx={{
          backgroundColor: "#1769aa",
          ":disabled": { color: "black" },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography
            sx={{
              color: members ? "white" : "black",
              fontSize: 25,
              textAlign: "center",
              fontWeight: 1000,
            }}
          >
            {roomInfo.title}
          </Typography>
        </AccordionSummary>
        {members && (
          <AccordionDetails>
            <Box sx={{ color: "white" }}>
              참여자
              {members.map((member, idx) => {
                return (
                  <Box
                    sx={{ textAlign: "right" }}
                    key={idx}
                  >{`${member.userName}(${member.userId})`}</Box>
                );
              })}
            </Box>
          </AccordionDetails>
        )}
      </Accordion>
    </>
  );
};

export default RoomInfo;
