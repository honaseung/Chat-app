import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type Modal = {
  title: string;
  content: string;
  open: boolean;
  setOpen(b: boolean): void;
  handleClose?: void;
};

const Modal: React.FunctionComponent<Modal> = ({
  title,
  content,
  open,
  setOpen,
  handleClose = () => {},
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
          <Button color="primary" onClick={onClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Modal;
