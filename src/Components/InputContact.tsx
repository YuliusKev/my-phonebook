/** @jsxImportSource @emotion/react */
import {
  Button,
  FormGroup,
  TextField,
  Alert,
  FormControl,
  InputAdornment,
  IconButton,
  OutlinedInput,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { LOAD_CONTACT_LISTS } from "../GraphQL/Queries.tsx";
import { ADD_CONTACT, EDIT_CONTACT } from "../GraphQL/Mutations.tsx";
import { Grid } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function InputContactForm() {
  const navigate = useNavigate();
  const params = useParams();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [listPhone, setListPhone] = useState([{ number: "" }]);
  const [nameError, setNameError] = useState<boolean>(false);
  const [contactExist, setContactExist] = useState(false);

  const { data: contactList } = useQuery<{
    contact: Array<{
      id: number;
      created_at: string;
      first_name: string;
      last_name: string;
      phones: Array<{ number: string }>;
    }>;
  }>(LOAD_CONTACT_LISTS);

  const [phoneCounter, setPhoneCounter] = useState<number>(1);

  const checkNameCharacters = (value: string, type: string) => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const phoneNumberChar = "0123456789";

    if (!specialChars.test(value)) {
      type === "first_name" ? setFirstName(value) : setLastName(value);
    } else {
      setNameError(true);
    }
  };

  const [addContactWithPhones] = useMutation(ADD_CONTACT);
  const [EditContactById] = useMutation(EDIT_CONTACT);

  const addContact = async () => {
    let invalid = false;

    if (firstName === lastName) {
      setNameError(true);

      return;
    }

    for (let index = 0; index < contactList!.contact.length; index++) {
      const contact = contactList!.contact[index];

      if (
        contact.first_name === firstName &&
        contact.last_name === lastName &&
        contact.phones.some((phone) =>
          listPhone.some((p) => p.number === phone.number)
        )
      ) {
        setContactExist(true);

        invalid = true;

        break;
      }
    }

    if (invalid) {
      return;
    }

    if (params.id) {
      console.log(firstName);

      try {
        await EditContactById({
          variables: {
            id: params.id,
            _set: {
              first_name: firstName,
              last_name: lastName,
            },
          },
        });

        navigate("/");
      } catch (error) {}
    } else {
      try {
        await addContactWithPhones({
          variables: {
            first_name: firstName,
            last_name: lastName,
            phones: listPhone,
          },
        });

        navigate("/");
      } catch (error) {}
    }
  };

  const addPhone = () => {
    setListPhone((value) => {
      return [...value, { number: "" }];
    });
  };

  const valuePhoneNumber = (index: number, phoneNumber: string) => {
    if (/^\+?\d*$/gi.test(phoneNumber)) {
      setListPhone((prevPhone) => {
        const newPhoneList = [...prevPhone];
        newPhoneList[index].number = phoneNumber;
        return newPhoneList;
      });
    }
  };

  useEffect(() => {
    const contact = contactList?.contact.find(
      (contact) => contact.id.toString() === params.id
    );

    if (contact) {
      setFirstName(contact.first_name);
      setLastName(contact.last_name);
      setListPhone(contact.phones);
    }
  }, [contactList?.contact]);

  const deleteContact = (index : number) => {
    if(listPhone.length >1 ){
        setListPhone(list => {
            const tempList = list.slice()
            tempList.splice(index, 1)
            return tempList
        })
    }
  };

  return (
    <Grid>
      {contactExist && <Alert severity="error">Contact already exist!</Alert>}

      <FormGroup sx={{ paddingTop: 2 }}>
        <TextField
          label="Nama Depan"
          variant="outlined"
          value={firstName}
          onChange={(e) => checkNameCharacters(e.target.value, "first_name")}
          sx={{ margin: "5px" }}
        />
        <TextField
          label="Nama Belakang"
          variant="outlined"
          value={lastName}
          onChange={(e) => checkNameCharacters(e.target.value, "last_name")}
          sx={{ margin: "5px" }}
        />
        {!params.id &&
          listPhone.map((value, index) => {
            return (
              <FormControl key={index} variant="outlined">
                <TextField
                  label="Nomor Telepon"
                  variant="outlined"
                  value={value.number}
                  onChange={(e) => valuePhoneNumber(index, e.target.value)}
                  sx={{ margin: "5px" }}
                  InputProps={{
                    endAdornment: (
                      <IconButton  key={index} onClick={(id) => deleteContact(index)}>
                        <DeleteIcon />
                      </IconButton>
                    ),
                  }}
                />
              </FormControl>
            );
          })}
        {!params.id && (
          <Button
            variant="outlined"
            sx={{ margin: "5px" }}
            onClick={() => addPhone()}
          >
            Tambah Nomor Telepon
          </Button>
        )}
        <Button
          variant="contained"
          sx={{ margin: "5px" }}
          onClick={() => addContact()}
        >
          Masukkan Kontak
        </Button>
      </FormGroup>
    </Grid>
  );
}

export default InputContactForm;
