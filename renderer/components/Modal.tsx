import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type Modal = {
  title: string,
  content: string,
  open: boolean,
  setOpen(b: boolean): void,
  type?: string,
  onConfirm?: Function,
  handleClose?: Function,
}

const Modal: React.FunctionComponent<Modal> = ({
  title,
  content,
  open,
  setOpen,
  type = "",
  onConfirm = () => { },
  handleClose = () => { },
}) => {
  const onClose = () => {
    if (handleClose) {
      handleClose();
    }
    setOpen(false);
  };
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {type === "confirm" ? (
            <div>
              <Button color="secondary" onClick={onClose}>
                NO
              </Button>
              <Button color="primary" onClick={() => onConfirm()}>
                OK
              </Button>
            </div>
          ) : (
            <Button color="primary" onClick={onClose}>
              OK
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Modal;
