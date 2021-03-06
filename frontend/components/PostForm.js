import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import Button from '@material-ui/core/Button';
import ReactPlayer from 'react-player';
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth';

const styles = theme => ({
  container: {
    display: 'flex',
    marginTop: 64,
    paddingTop: 100
  },
  formContainer: {
    margin: 'auto'
  },
  TextField: {
    display: 'block'
  },
  button: {
    marginTop: 20
  },
  input: {
    display: 'none'
  },
  previewImage: {
    maxWidth: 552,
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  }
});

const PostForm = ({
  classes, onSubmit, isOpen, onClose, editedPost, enqueueSnackbar, width
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [type, setType] = useState('');

  const onSubmitClicked = () => {
    if (title.trim().length === 0 || description.trim().length === 0) {
      enqueueSnackbar('title or description should not be blank', { variant: 'error' });
      return;
    }
    onSubmit(title, description, file);
    setTitle('');
    setDescription('');
  };

  const onImagePick = (e) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      reader.readAsDataURL(selectedFile);
      const fileType = selectedFile.type.split('/')[0];
      setType(fileType);
    }
  };

  useEffect(() => {
    setTitle(editedPost ? editedPost.title : '');
    setDescription(editedPost ? editedPost.description : '');
    setFile(null);
    setImagePreviewUrl(editedPost ? editedPost.presignedUrl : '');
    setType(editedPost ? editedPost.mediaType : '');
  }, [editedPost]);

  return (
    <div>
        <Dialog
            open={isOpen}
            onClose={onClose}
            aria-labelledby="form-dialog-title"
            >
            <DialogTitle id="form-dialog-title">{editedPost !== null ? 'Edit' : 'Post'}</DialogTitle>
            <DialogContent>
            <TextField
            value={title}
            onChange={e => setTitle(e.target.value)}
              autoFocus
              margin="dense"
              id="title"
              label="title"
              type="text"
              fullWidth
            />
            <TextField
            value={description}
            onChange={e => setDescription(e.target.value)}
              autoFocus
              margin="dense"
              id="description"
              label="description"
              type="text"
              multiline={true}
              rows={isWidthDown('sm', width) ? 2 : 5}
              fullWidth
            />
            {(imagePreviewUrl !== '' && type !== '') && (
              type === 'video'
                ? <ReactPlayer volume={0} muted={true} playsinline height='auto' width={isWidthDown('sm', width) ? '100%' : 400} url={imagePreviewUrl} playing loop/>
                : <img className={classes.previewImage} src={imagePreviewUrl} />
            )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <input
                  accept="image/*,video/*"
                  className={classes.input}
                  id="text-button-file"
                  onChange={onImagePick}
                  type="file" />
                  <label htmlFor="text-button-file">
                    <Button component="span">
                      {isWidthUp('sm', width) && 'Select'} File
                    </Button>
                  </label>
                <Button onClick={onSubmitClicked} color="primary">
                  {editedPost !== null ? 'Edit' : 'Post'}
                </Button>
          </DialogActions>
        </Dialog>
    </div>
  );
};

export default withSnackbar(withStyles(styles)(withWidth()(PostForm)));
