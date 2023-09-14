import React, {useEffect, useState} from 'react';
import {useQuery, gql, useMutation}from '@apollo/client'
import {LOAD_CONTACT_LISTS} from "../GraphQL/Queries"
import  { DELETE_CONTACT } from '../GraphQL/Mutations.tsx'
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
import { useLocalStorageState } from 'ahooks';

function ShowLists() {
    const defaultFavourite = [
        {},
    ]
    const excludeDefaultArray = [0];
    const [search, setSearch] = useState<string>("");
    const [list, setList] = useState(Array());
    const [missing, setMissing] = useState<boolean>(false)
    const [favouriteList, setFavouriteList] = useLocalStorageState(
        'use-local-storage-state-demo1', {
            defaultValue: defaultFavourite
        },
    )
    const [excludeData, setExcludeData] = useLocalStorageState(
        'use-local-storage-state-demo2', {
            defaultValue: excludeDefaultArray
        },
    )
    
    const firstFetch = {
        limit: 10,
        offset: 0,
        where:{
            _and: {id : {_nin : excludeData}}
        }
    }

    const {error, loading, data, refetch, fetchMore} = useQuery(LOAD_CONTACT_LISTS, {
        variables: firstFetch
    });

    const [deleteContactData, { error: deleteError }] =  useMutation(DELETE_CONTACT);

    const deleteContact = async (id : number) => {
        await deleteContactData({
            variables: {
                "id": id,
            }
        })

        if(deleteError) {
            return <h1>ERROR</h1>
        } else {
            const listData = refetch();
            setList((await listData).data.contact)
        }
    }
    
    const searchValue = (value: string) => {
        setSearch(value);
        if(search){
            setMissing(true);
            refetch({ where : {first_name: {_ilike: `%${value}%` } }})
            console.log(missing)
        } else {
            setMissing(false);
        }
    }

    useEffect(() => {
        if(data){
            setList(data.contact)

        }
    }, [data])

    async function testFetchMore ( test: number) {
        const push = await fetchMore({ variables: { offset: 10}})
        console.log(test)

        if(push){
            setList((prevData) => {
                const newData = [...prevData, ...push.data.contact];
                return newData
            })
        }
    }
    const setStorage = (data : object) => {
        setFavouriteList([...favouriteList, data]);
        setExcludeData([...excludeData, data['id']])

    }
    return (
        <Box height="100vh" sx={{bgcolor: '#1e1e1e'}}>
            <Box sx={{ padding:2 }}>
                <TextField label="Search Contact" value={search || ""} variant="outlined" sx={{ width:"100%", height: 10,  borderColor: "grey", input: { color: 'white' }, Label: { color: '#c0c0c0'}}} onChange={(e) => searchValue(e.target.value)}/>
            </Box>
            <Grid sx={{ marginTop:2 }}>
                <List>
                    {favouriteList?.map( (fav) => {
                        return (
                            <React.Fragment key={fav['id']}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar sx={{bgcolor: "aqua"}}>
                                            <PersonOutlineIcon sx={{color: 'white'}}/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${fav['first_name']} ${fav['last_name']}`}
                                        sx={{ color: 'white'}}
                                    >
                                    </ListItemText>
                                </ListItem>
                            </React.Fragment>
                        )
                    })}
                </List>
            </Grid>
            <Grid>
                <InfiniteScroll dataLength={list.length} next={() => testFetchMore(list.length)} hasMore={true} loader={""}>
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
                                            <IconButton onClick={() => setStorage(thedata)}>
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
            </Grid>
        </Box>
    )
  }
  
  export default ShowLists;