import React, {useEffect, useState} from 'react';
import {useQuery, useMutation }from '@apollo/client'
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
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
      }
    interface PhoneType {
        number : string,
    }
    interface ContactType {
            created_at: string,
            first_name: string,
            id: number, 
            last_name: string,
            phones: PhoneType[]
     }

    const defaultFavourite : ContactType[] = [
        {
            created_at: "",
            first_name: "",
            id: 0, 
            last_name: "",
            phones: [{number: ""}]
        }
    ];
    const [search, setSearch] = useState<string>("");
    const [list, setList] = useState(Array());
    const [missing, setMissing] = useState<boolean>(false)
    const [favouriteList, setFavouriteList] = useLocalStorageState(
        'favourite-list', {
            defaultValue: [{
                    created_at: "",
                    first_name: "",
                    id: 0, 
                    last_name: "",
                    phones: [{number: ""}]
                }] 
        },
    )
    const [favouriteId, setFavouriteId] = useLocalStorageState<number[] | undefined>(
        'favourite-id', {
            defaultValue: [0]
        }
    )
    
    const firstFetch = {
        limit: 10,
        offset: 0,
        where:{
            _and: {id : {_nin : favouriteId}}
        }
    }

    const {error, loading, data, refetch, fetchMore} = useQuery(LOAD_CONTACT_LISTS, {
        variables: firstFetch
    });

    useEffect(() => {
        if(data){
            setList(data.contact)
        }
    }, [data])

    const [deleteContactData, { error: deleteError }] =  useMutation(DELETE_CONTACT);    

    const refetchList = async () => {
        const listData = refetch();
        setList((await listData).data.contact)
    } 

    const onClickdelete = async (id : number) => {
        await deleteContactData({
            variables: {
                "id": id,
            }
        })

        if(deleteError) {
            return <h1>ERROR</h1>
        } else {
           refetchList()
        }
    }
    
    const searchValue = (value: string) => {
        setSearch(value);
        refetch({ where : {first_name: {_ilike: `%${value}%` } }})
        if(value == ""){
            setMissing(false);
        } else {
            setMissing(true);
        }
    }

    function onBottomPage () {
        fetchMore({ 
            variables: { limit:data.contact.length + 10,  offset: data.contact.length},
            updateQuery: (prev, { fetchMoreResult }) => {
                console.log(fetchMoreResult)
               if(!fetchMoreResult) {return prev};
               return {
                    contact: [...prev.contact, ...fetchMoreResult.contact || 0],
               }
            }
        })
    }

    async function onClickFavourite (data : ContactType) {
        if(favouriteId && favouriteList){
            if(favouriteId.includes(data.id)){
                if(favouriteId.length == 1)
                {
                    setFavouriteId([0]);
                    setFavouriteList(defaultFavourite);
                }else {
                    setFavouriteId(favouriteId.filter((newData) => {return newData !== data.id}));
                    setFavouriteList(favouriteList.filter((newData) => {return newData !== data}))
                }
            } else {
                setFavouriteId([...favouriteId, data.id])
                setFavouriteList([...favouriteList, data]);

            }
        }
    }
    return (
        <Grid sx={{height: "100vh", bgcolor: '#1e1e1e'}}>
            <Box sx={{ padding:2 }}>
                <TextField label="Search Contact" value={search || ""} variant="outlined" sx={{ width:"100%",  borderColor: "grey", input: { color: 'white' }, Label: { color: '#c0c0c0'}}} onChange={(e) => searchValue(e.target.value)}/>
            </Box>
            <Grid sx={{ marginTop:2, display: (missing) ? "none" : "block" }}>
                <List sx={{bgcolor: '#1e1e1e'}}>
                    {favouriteList?.map( (favItem) => {
                        if(favItem.id !== 0 ){
                            return (
                                <React.Fragment key={favItem.id}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar sx={{bgcolor: "aqua"}}>
                                                <PersonOutlineIcon sx={{color: 'white'}}/>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${favItem.first_name} ${favItem.last_name} - ${favItem?.phones[0]?.number}`}
                                            sx={{ color: 'white'}}
                                        >
                                        </ListItemText>
                                        <ListItemIcon sx={{justifyContent: 'right'}}>
                                            <IconButton onClick={() => onClickFavourite(favItem)}>
                                                <StarIcon sx={{ color: "yellow"}}/>
                                            </IconButton> 
                                        </ListItemIcon>
                                    </ListItem>
                                </React.Fragment>
                            )
                        }
                    })}
                </List>
            </Grid>
            <Divider sx={{ bgcolor: "white"}}/>
            <Grid sx={{bgcolor: '#1e1e1e'}}>
                <InfiniteScroll dataLength={list.length} next={() => onBottomPage()} hasMore={true} loader={""}> 
                    <List sx={{bgcolor: '#1e1e1e'}}>
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
                                            <IconButton onClick={() => onClickFavourite(thedata)}>
                                                <StarIcon sx={{ color: (favouriteId?.includes(thedata.id )) ? 'yellow' : "white"}}/>
                                            </IconButton> 
                                            <IconButton onClick={() => onClickdelete(thedata.id)}>
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
        </Grid>
    )
  }
  
  export default ShowLists;