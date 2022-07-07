// Import createAsyncThunk and createSlice here.
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { response } from 'msw';

// Create loadCommentsForArticleId here.
export const loadCommentsForArticleId = createAsyncThunk(
    'comments/loadCommentsForArticleId',
    async (id, thunkAPI) => {
        const response = await fetch(`api/articles/${id}/comments`);
        const json = await response.json();
        return json
    }
)

// Create postCommentForArticleId here.
export const postCommentForArticleId = createAsyncThunk(
    'comments/postCommentForArticleId',
    async ({articleId, comment}, thunkAPI) => {
        const requestBody = JSON.stringify({comment: comment})
        const response = await fetch(`api/articles/${articleId}/comments`, {
            method: 'POST', 
            body: requestBody
        })
        const json = await response.json()
        return json
    }
)

export const commentsSlice = createSlice({
    name: 'comments',
    initialState: {
      // Add initial state properties here.
      byArticleId: {},
      isLoadingComments: false,
      failedToLoadComments: false,
      createCommentIsPending: false,
      failesToCreateComment: false
    },
    // Add extraReducers here.
    extraReducers: {
        [loadCommentsForArticleId.pending]: (state, action)=>{
            state.isLoadingComments = true;
            state.failedToLoadComments = false;
        },
        [loadCommentsForArticleId.fulfilled]: (state, action)=>{
            state.byArticleId[action.payload.articleId] = action.payload.comments.map(comment=>comment.text)
            state.isLoadingComments = false;
            state.failedToLoadComments = false;
        },
        [loadCommentsForArticleId.rejected]: (state, action)=>{
            state.isLoadingComments = false;
            state.failedToLoadComments = true;
        },
        [postCommentForArticleId.pending]: (state, action)=>{
            state.createCommentIsPending = true;
            state.failesToCreateComment = false;
        },
        [postCommentForArticleId.fulfilled]: (state, action)=>{
            state.byArticleId[action.payload.articleId].push(action.payload.text)
            state.createCommentIsPending = false;
            state.failesToCreateComment = false;
        },
        [postCommentForArticleId.rejected]: (state, action)=>{
            state.createCommentIsPending = false;
            state.failesToCreateComment = true;
        }
    }
  });
  
  export const selectComments = (state) => state.comments.byArticleId;
  export const isLoadingComments = (state) => state.comments.isLoadingComments;
  export const createCommentIsPending = (state) => state.comments.createCommentIsPending;
  
  export default commentsSlice.reducer;
  