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
                <InputLabel css={styles.input}>Nama Depan: </InputLabel>
                <TextField  css={styles.input}/>
                <InputLabel css={styles.input}>Nama Belakang: </InputLabel>
                <TextField  css={styles.input}/>
                <InputLabel css={styles.input}>Nomor Telepon: </InputLabel>
                <TextField type='number'  css={styles.input}/>
                <Button variant="outlined" css={styles.button}>Tambah Nomor Telepon</Button>
                <Button variant="contained" css={styles.button}>Masukkan Kontak</Button>
            </FormGroup>
        </div>
    );
}

export default InputContactForm;