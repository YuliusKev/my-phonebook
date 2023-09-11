/** @jsxImportSource @emotion/react */
import { Button, FormGroup, InputLabel, TextField } from '@mui/material';
import * as React from 'react';
import * as styles from  "./InputContact.style.ts"

  
function InputContactForm() {
    return (
        <div>
            <h1 css={styles.title}>
                Masukkan Contact
            </h1>
            <FormGroup>
                <InputLabel>Nama Depan: </InputLabel>
                <TextField />
                <InputLabel>Nama Belakang: </InputLabel>
                <TextField />
                <InputLabel >Nomor Telepon: </InputLabel>
                <TextField type='number' />
                <Button variant="outlined">Tambah Nomor Telepon</Button>
                <Button variant="contained">Masukkan Kontak</Button>
            </FormGroup>
        </div>
    );
}

export default InputContactForm;