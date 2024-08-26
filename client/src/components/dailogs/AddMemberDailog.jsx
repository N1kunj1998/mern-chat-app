import React, { useState } from 'react'
import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material'
import { sampleUsers } from '../../constants/sampleData'
import UserItem from '../shared/UserItem'
import { useDispatch, useSelector } from 'react-redux'
import { setIsAddMember } from '../../redux/reducers/misc'
import { useAddGroupMemberMutation, useAvailableFriendsQuery } from '../../redux/api/api'
import { useAsyncMutation, useErrors } from '../../hooks/hooks'

const AddMemberDailog = ({ chatId}) => {

    const { isAddMember } = useSelector(state => state.misc);

    const dispatch = useDispatch();
    const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);
    const [ addMembers, isLoadingAddMembers ] = useAsyncMutation(useAddGroupMemberMutation);
    
    const [members, setMembers] = useState(sampleUsers);
    const [selectedMembers, setSelectedMembers] = useState([]);
    
    const selectMemberHandler = (id) => {
      setSelectedMembers((prev) =>
      prev.includes(id)
      ? prev.filter((currElement) => currElement !== id)
      : [...prev, id]
      );
    };
    
    const addMemberSubmitHandler = () => {
      addMembers("Adding Members...", { members: selectedMembers, chatId });
      closeHandler();
    };
    const closeHandler = () => {
      dispatch(setIsAddMember(false));
    };

    useErrors([{ isError, error }]);
    return (
    <Dialog open={isAddMember} onClose={closeHandler}>
        <Stack spacing={"1rem"} p={"2rem"} width={"21rem"}>
            <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
            <Stack>
                {
                    isLoading ? <Skeleton /> : data?.friends.length > 0 ? data?.friends.map((i) => (
                        <UserItem key={i._id} user={i} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)}/>
                    )) : <Typography textAlign={"center"}>No Friends</Typography>
                }
            </Stack>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <Button color='error' variant='outlined' onClick={closeHandler}>Cancle</Button>
                <Button variant='contained' disabled={isLoadingAddMembers} onClick={addMemberSubmitHandler}>Submit Changes</Button>
            </Stack>
        </Stack>
    </Dialog>
  )
}

export default AddMemberDailog