import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'

const ConfirmDeleteDailog = ({open, handleClose, deleteHandler}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Are you sure you want to delete this group?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={deleteHandler}>Yes</Button>
            <Button color='error' onClick={handleClose}>No</Button>
        </DialogActions>
    </Dialog>
  )
}

export default ConfirmDeleteDailog