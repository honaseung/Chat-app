import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FilledInput, FormControl, FormHelperText, InputLabel } from "@mui/material";

type InviteModal = {
  open: boolean;
  onClose(): void;
  content: string;
  roomTitle: string;
  setRoomTitle(s: string): void;
  setOpen(b: boolean): void;
  onConfirm?: Function;
  handleClose?: Function;
}

const InviteModal: React.FunctionComponent<InviteModal> = ({ open, setOpen, content, roomTitle, setRoomTitle, onConfirm, handleClose }) => {
  const onClose = () => {
    if (handleClose) {
      handleClose();
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
          <FormControl>
            <InputLabel htmlFor="input-id">방 제목</InputLabel>
            <FilledInput
              value={roomTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomTitle(e.target.value)}
              name="input-id"
              id="input-id"
              aria-describedby="TITLE"
              type="email"
              error={!roomTitle}
            />
            <FormHelperText id="TITLE">
              방 제목을 입력해주세요.
            </FormHelperText>
          </FormControl>
          <div>
            <Button color="secondary" onClick={onClose}>
              NO
            </Button>
            <Button color="primary" onClick={() => onConfirm()} disabled={!roomTitle}>
              OK
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default InviteModal;