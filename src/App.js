import React, { useState, useRef } from 'react';
import {
  Container,
  Card,
  CardContent,
  makeStyles,
  Grid,
  TextField,
  Button,
} from '@material-ui/core';
import QRCode from 'qrcode';
import QrScanner from 'qr-scanner';

function App() {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const classes = useStyles();
  const fileRef = useRef(null);

  const generateQrCode = async () => {
    try {
      const response = await QRCode.toDataURL(text);
      setImageUrl(response);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleClick = () => {
    fileRef.current.click();
  };

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const result = await QrScanner.scanImage(file);
      setData(result);
    }
  };

  return (
    <Container className={classes.container}>
      <Card>
        <h2 className={classes.title}>Generate Download & Scan QR Code with React js</h2>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <TextField label="Enter Text Here" onChange={(e) => setText(e.target.value)} />
              <Button className={classes.btn} variant="contained" color="primary" onClick={() => generateQrCode()}>Generate</Button>
              <br />
              <br />
              <br />
              {imageUrl ? (
                <a href={imageUrl} download>
                  <img src={imageUrl} alt="img" />
                </a>
              ) : null}
            </Grid>
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <Button className={classes.btn} variant="contained" color="secondary" onClick={handleClick}>
                Scan QR Code
              </Button>
              <input
                type="file"
                ref={fileRef}
                onChange={handleChange}
                accept='.png, .jpg, jpeg'
                style={{ display: 'none' }}
              />
              {data && <h3>Scanned Code: {data}</h3>}
            </Grid>
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}></Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 10,
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#3f51b5',
    color: '#fff',
    padding: 20,
  },
  btn: {
    marginTop: 10,
  },
}));

export default App;
