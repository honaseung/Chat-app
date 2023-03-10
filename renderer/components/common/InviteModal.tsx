import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FilledInput,
  FormControl,
  FormHelperText,
  InputLabel,
} from "@mui/material";

type InviteModal = {
  open: boolean;
  onClose?(): void;
  content: string;
  roomTitle: string;
  setRoomTitle(s: string): void;
  setOpen(b: boolean): void;
  onConfirm?(): void;
  handleClose?(s: string): void;
};

/**
 *
 * @description 사용자를 채팅방에 초대하기 위한 컴포넌트 입니다.
 */
const InviteModal: React.FunctionComponent<InviteModal> = ({
  open,
  setOpen,
  content,
  roomTitle,
  setRoomTitle,
  onConfirm,
  handleClose,
}) => {
  const onClose = () => {
    if (handleClose) {
      handleClose("");
    }
    setOpen(false);
  };
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>초대하기</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <FormControl fullWidth>
            <InputLabel htmlFor="input-id">방 제목</InputLabel>
            <FilledInput
              value={roomTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRoomTitle(e.target.value)
              }
              name="input-id"
              id="input-id"
              aria-describedby="TITLE"
              type="email"
              error={!roomTitle}
            />
            <FormHelperText id="TITLE">방 제목을 입력해주세요.</FormHelperText>
          </FormControl>
          <ButtonGroup>
            <Button color="secondary" onClick={onClose}>
              NO
            </Button>
            <Button
              color="primary"
              onClick={() => {
                onConfirm();
              }}
              disabled={!roomTitle}
            >
              OK
            </Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InviteModal;
