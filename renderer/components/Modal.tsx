import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const Modal = ({
  title,
  content,
  open,
  setOpen,
  type = "",
  onConfirm = null,
  handleClose = null,
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
              <Button color="primary" onClick={onConfirm}>
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
