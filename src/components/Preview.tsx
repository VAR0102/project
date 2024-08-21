import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { ILike, IComment, IProps } from '../helpers/types';
import { handleComments, handleLikes } from '../helpers/api';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export function Preview({ open, onClose, post }: IProps) {
  const [likes, setLikes] = useState<ILike[]>([]); 
  const [comments, setComments] = useState<IComment[]>([]);
  const [newComment, setNewComment] = useState<string>('');

  useEffect(() => {
    if (open) {
      fetchLikes();
      fetchComments();
    }
  }, [open]);

  const fetchLikes = async () => {
   
      const response = await handleLikes(post);
      if (Array.isArray(response)) {
        setLikes([response.payload as ILike]);
      } else {
        console.error('Expected an array for likes, received:', response);
      }
    
  };

  const fetchComments = async () => {
    
      const response = await handleComments(post);
      if (Array.isArray(response)) {
        setComments([response.payload as IComment]) ;
      } else {
        console.error('Expected an array for comments, received:', response);
      }
    
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj: IComment = {
        id: comments.length + 1,
        user: 'Current User', 
        text: newComment,
        
      };
      setComments([...comments, newCommentObj]);
      setNewComment('');
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {likes.length} likes, {comments.length} comments
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Likes:</Typography>
            <Stack direction="row" spacing={2}>
              {likes.map((like) => (
                <Box key={like.id} textAlign="center">
                  <Avatar alt={like.name} src={like.avatar} />
                  <Typography variant="body2">{like.name}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Comments:</Typography>
            {comments.map((comment) => (
              <Box key={comment.id} sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>{comment.user} says:</strong> {comment.text}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="What do you think?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddComment();
                }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1 }}
              onClick={handleAddComment}
            >
              Comment
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
