import React, {useEffect, useState} from 'react';
import {useQuery, gql, useMutation}from '@apollo/client'
import {LOAD_CONTACT_LISTS} from "../GraphQL/Queries"
import  { DELETE_CONTACT } from '../GraphQL/Mutations.tsx'
import ContactHeader from "./ContactHeader"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Box, Divider, Grid, ListItemButton, TextField, ListItemIcon, IconButton  } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';

function ShowLists() {
    const [search, setSearch] = useState<string>("");
    const [list, setList] = useState(Array());
    const firstFetch = {
        limit: 10,
        offset: 0
    }

    const {error, loading, data, refetch, fetchMore} = useQuery(LOAD_CONTACT_LISTS, {
        variables: firstFetch
    });

    const [deleteContactData, { error: deleteError }] =  useMutation(DELETE_CONTACT);

    const deleteContact = (id : number) => {
        deleteContactData({
            variables: {
                "id": id,
            }
        })

        if(deleteError) {
            console.log(error);
        } else {
            window. location. reload();
        }
    }
    
    const searchValue = (value: string) => {
        setSearch(value);
        refetch({ where : {first_name: {_ilike: `%${value}%` } }})
    }

    useEffect(() => {
        if(data){
            setList(data.contact)
        }
    }, [data])

     async function testFetchMore ( test: number) {
        const push = await fetchMore({ variables: { offset: test}})
        if(push){
            setList((prevData) => {
                const newData = [...prevData, ...push.data.contact];
                return newData
            })
        }
    }
    return (
        <Box height="100vh" sx={{ bgcolor: "#1e1e1e"}}>
            <Grid sx={{ padding:2 }}>
                <TextField label="Search Contact" value={search || ""} variant="outlined" sx={{ width:"100%", height: 10,  borderColor: "grey", input: { color: 'white' }, Label: { color: '#c0c0c0'}}} onChange={(e) => searchValue(e.target.value)}/>
            </Grid>
            <InfiniteScroll dataLength={list.length} next={() => testFetchMore(list.length  || 0)} hasMore={true} loader={""}>
                <List>
                    {list.map((thedata) => {
                        return (
                            <React.Fragment key={thedata.id}>
                                <ListItem>
                                    <ListItemButton onClick={() => console.log(thedata.id)}>
                                        <ListItemAvatar>
                                            <Avatar sx={{bgcolor: "aqua"}}>
                                                <PersonOutlineIcon sx={{color: 'white'}}/>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${thedata?.first_name || ''} ${thedata?.last_name || ""} - ${thedata?.phones[0]?.number || ""}`}
                                            sx={{ color: 'white'}}
                                        >
                                        </ListItemText>
                                    </ListItemButton>
                                    <ListItemIcon sx={{justifyContent: 'right'}}>
                                        <IconButton onClick={() => console.log("STAR")}>
                                            <StarIcon sx={{ color: "white"}}/>
                                        </IconButton> 
                                        <IconButton onClick={() => deleteContact(thedata.id)}>
                                            <DeleteIcon sx={{ color: "white"}}/>
                                        </IconButton> 
                                    </ListItemIcon>
                                </ListItem>
                                <Divider sx={{ bgcolor: "white"}}/>
                            </React.Fragment>
                        )
                    })} 
                </List>
            </InfiniteScroll>
        </Box>
    )
  }
  
  export default ShowLists;