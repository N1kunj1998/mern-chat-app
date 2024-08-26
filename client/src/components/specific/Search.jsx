import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAsyncMutation } from '../../hooks/hooks';
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api';
import { setIsSearch } from '../../redux/reducers/misc';
import UserItem from '../shared/UserItem';

const Search = () => {

  const dispatch = useDispatch();

  const { isSearch } = useSelector(state => state.misc);

  const [ searchUser ] = useLazySearchUserQuery("");
  const [ sendFriendRequest, isLoadingSendFriendRequest ] = useAsyncMutation(useSendFriendRequestMutation);

  const search = useInputValidation("");

  const [users, setUsers] = useState([]);

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { receiverId: id});
  };

  const searchCloseHandler = () => dispatch(setIsSearch(false));

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search.value).then(({data}) => setUsers(data.users)).catch(e => console.log(e));
    }, 600);

    return () => {
      clearTimeout(timeOutId);
    }
    
  }, [search.value]);
  

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack padding={"2rem"} direction={'column'} width={"25rem"}>
        <DialogTitle textAlign={'center'}>Find People</DialogTitle>
        <TextField label="" value={search.value} onChange={search.changeHandler} variant='outlined' size='small' InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon/>
            </InputAdornment>
          )
        }}/>
      </Stack>
      
      <List>
        {
          users.map((user) => (
            <UserItem user={user} key={user._id} handler={addFriendHandler} handlerIsLoading={isLoadingSendFriendRequest} />
          ))
        }
      </List>
    </Dialog>
  )
}

export default Search