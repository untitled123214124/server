import Express from 'express';
import {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getPosts,
} from '../controllers/postController';
import {
  createPostValidationRules,
  deletePostValidationRules,
  updatePostValidationRules,
  getPostValidationRules,
  getPostsValidationRules,
  validatePost,
} from '../validator.ts/postValidator';

const router = Express.Router({ mergeParams: true });

router.post('/', createPostValidationRules(), validatePost, createPost);
router.put('/:postId', updatePostValidationRules(), validatePost, updatePost);
router.delete(
  '/:postId',
  deletePostValidationRules(),
  validatePost,
  deletePost
);
router.get('/:postId', getPostValidationRules(), validatePost, getPost);
router.get('/', getPostsValidationRules(), validatePost, getPosts);

export default router;
