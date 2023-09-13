import React, {useEffect, useState} from 'react';
import {useQuery, gql}from '@apollo/client'
import {LOAD_CONTACT_LISTS} from "../GraphQL/Queries"
import ContactHeader from "./ContactHeader"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Box, Divider, Grid, ListItemButton, TextField  } from '@mui/material';

function ShowLists() {
    const [search, setSearch] = useState<string>("");
    const [whereSearch, setWhereSearch] = useState<Object>();
    const [list, setList] = useState(Array());

    const {error, loading, data, refetch} = useQuery(LOAD_CONTACT_LISTS, {
        variables: { whereSearch }
    });
    
    const searchValue = (value: string) => {
        setSearch(value);
        
        setWhereSearch({where : {
            first_name : {_like: `%${value}%` }
        }})
        console.log(whereSearch)
        refetch({ variables: whereSearch })
    }

    useEffect(() => {
        if(data){
            setList(data.contact)
        }
    }, [data])
    
    return (
        <>
            <ContactHeader />
            <Divider sx={{ bgcolor: "grey", opacity:0.5}}/>
            <Grid sx={{ padding:2, }}>
                <TextField label="Search Contact" value={search || ""} variant="outlined" sx={{ width:"100%", borderColor: "grey", input: { color: 'white' }, Label: { color: '#c0c0c0'}}} onChange={(e) => searchValue(e.target.value)}/>
            </Grid>
            <List>
                {list.map((thedata) => {
                    return (
                        <React.Fragment key={thedata.id}>
                            <ListItem>
                                <ListItemButton>
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
                                    <Divider sx={{ bgcolor: "white"}}/>
                                </ListItemButton>
                            </ListItem>                
                        </React.Fragment>
                    )
                })} 
            </List>
        </>
    )
  }
  
  export default ShowLists;