import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { LOAD_CONTACT_LISTS } from "../GraphQL/Queries";
import { DELETE_CONTACT } from "../GraphQL/Mutations.tsx";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import {
  Box,
  Divider,
  Grid,
  TextField,
  ListItemIcon,
  IconButton,
  Typography,
  Link,
} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import StarIcon from "@mui/icons-material/Star";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocalStorageState } from "ahooks";
import { Link as RouterLink } from "react-router-dom";

function ShowLists() {
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
  interface PhoneType {
    number: string;
  }
  interface ContactType {
    created_at: string;
    first_name: string;
    id: number;
    last_name: string;
    phones: PhoneType[];
  }

  const [search, setSearch] = useState<string>("");
  const [list, setList] = useState(Array());
  const [missing, setMissing] = useState<boolean>(false);
  const [favouriteList, setFavouriteList] = useLocalStorageState<ContactType[]>(
    "favourite-list",
    {
      defaultValue: [],
    }
  );

  const firstFetch = {
    limit: 10,
    offset: 0,
    where: {
      _and: { id: { _nin: favouriteList?.map((list) => list.id) } },
    },
  };

  const { data, refetch, fetchMore } = useQuery(
    LOAD_CONTACT_LISTS,
    {
      variables: firstFetch,
    }
  );

  useEffect(() => {
    if (data) {
      setList(data.contact);
    }
  }, [data]);

  const [deleteContactData, { error: deleteError }] =
    useMutation(DELETE_CONTACT);

  const refetchList = async () => {
    const listData = refetch();
    setList((await listData).data.contact);
  };

  const addFavorite = (data: any) => {
    setFavouriteList([...(favouriteList ?? []), data]);
  };

  const isFavorite = (id: number) =>
    favouriteList?.some((list) => list.id === id);

  const removeFavorite = (id: number) => {
    const favoriteIndex =
      favouriteList?.findIndex((list) => list.id === id) ?? -1;

    if (favoriteIndex > -1) {
      const tempList = favouriteList?.slice();

      tempList?.splice(favoriteIndex, 1);

      setFavouriteList(tempList);
    }
  };

  const onClickdelete = async (id: number) => {
    await deleteContactData({
      variables: {
        id: id,
      },
    });

    removeFavorite(id);

    if (deleteError) {
      return <h1>ERROR</h1>;
    } else {
      refetchList();
    }
  };

  const searchValue = (value: string) => {
    setSearch(value);
    refetch({ where: { first_name: { _ilike: `%${value}%` } } });
    if (value === "") {
      setMissing(false);
    } else {
      setMissing(true);
    }
  };

  function onBottomPage() {
    fetchMore({
      variables: {
        limit: 10,
        offset: Math.ceil(data.contact.length / 10) * 10,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (fetchMoreResult.contact.length === 0) {
          return prev;
        }

        return {
          contact: [...prev.contact, ...fetchMoreResult.contact],
        };
      },
    });
  }

  return (
    <Grid sx={{ height: "100vh" }}>
      <Box sx={{ padding: 2 }}>
        <TextField
          label="Search Contact"
          value={search || ""}
          variant="outlined"
          sx={{
            width: "100%",
            borderColor: "grey",
            Label: { color: "#c0c0c0" },
          }}
          onChange={(e) => searchValue(e.target.value)}
        />
      </Box>

      {(favouriteList?.length ?? 0) > 0 && (
        <>
          <Grid sx={{ display: missing ? "none" : "block" }}>
            <Typography ml={2}>Favorite</Typography>
            <List>
              {favouriteList?.map((favItem) => {
                  return (
                    <React.Fragment key={favItem.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <PersonOutlineIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${favItem.first_name} ${favItem.last_name} - ${favItem?.phones[0]?.number}`}
                        ></ListItemText>
                        <ListItemIcon sx={{ justifyContent: "right" }}>
                          <IconButton
                            onClick={() => removeFavorite(favItem.id)}
                          >
                            <StarIcon sx={{ color: "yellow" }} />
                          </IconButton>
                        </ListItemIcon>
                      </ListItem>
                    </React.Fragment>
                  );
              })}
            </List>
          </Grid>

          <Divider />
        </>
      )}

      <Grid>
        <InfiniteScroll
          dataLength={list.length}
          next={() => onBottomPage()}
          hasMore={true}
          loader={""}
        >
          <List>
            {list.map((thedata) => {
              return (
                <Link
                  key={thedata.id}
                  component={RouterLink}
                  to={"/edit-contact/" + thedata.id}
                  underline="none"
                  color="black"
                >
                  <Box sx={{ boxShadow: 3, margin: 1, borderRadius: 3 }}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <PersonOutlineIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${thedata?.first_name || ""} ${
                          thedata?.last_name || ""
                        } - ${thedata?.phones[0]?.number || ""}`}
                      ></ListItemText>

                      <ListItemIcon sx={{ justifyContent: "right" }}>
                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();
                            isFavorite(thedata.id)
                              ? removeFavorite(thedata.id)
                              : addFavorite(thedata);
                          }}
                        >
                          <StarIcon
                            sx={{
                              color: isFavorite(thedata.id)
                                ? "yellow"
                                : undefined,
                            }}
                          />
                        </IconButton>
                        {!isFavorite(thedata.id) && (
                          <IconButton
                            onClick={(e) => {
                              e.preventDefault();
                              onClickdelete(thedata.id);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </ListItemIcon>
                    </ListItem>
                  </Box>
                </Link>
              );
            })}
          </List>
        </InfiniteScroll>
      </Grid>
    </Grid>
  );
}

export default ShowLists;
