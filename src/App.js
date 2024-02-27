import React, { useState, useRef } from 'react';
import {
  Container,
  Card,
  CardContent,
  makeStyles,
  Grid,
  TextField,
  Button,
  Snackbar,
} from '@material-ui/core';
import QRCode from 'qrcode';
import QrScanner from 'qr-scanner';
import { QrReader } from 'react-qr-reader';

function App() {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [scanResultWebCam, setScanResultWebCam] = useState('');
  const [errorSnackbar, setErrorSnackbar] = useState({ open: false, message: '' });
  const classes = useStyles();
  const fileRef = useRef(null);

  const generateQrCode = async () => {
    try {
      const response = await QRCode.toDataURL(text);
      setImageUrl(response);
    } catch (error) {
      handleSnackbarOpen('Error scanning QR code');
      console.error('Error generating QR code:', error);
    }
  };

  const handleClick = () => {
    fileRef.current.click();
  };

  const handleChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        setFile(file);
        const result = await QrScanner.scanImage(file);
        setData(result);
      }
    } catch (error) {
      handleSnackbarOpen('Error scanning QR code');
      console.error('Error scanning QR code:', error);
    }
  };

  const handleErrorWebCam = (error) => {
    handleSnackbarOpen('Error with Webcam: ' + error);
    console.log(error);
  }

  const handleScanWebCam = (result) => {
    if (result) {
      setScanResultWebCam(result);
    }
  }

  const handleSnackbarOpen = (message) => {
    setErrorSnackbar({ open: true, message });
  };

  const handleSnackbarClose = () => {
    setErrorSnackbar({ ...errorSnackbar, open: false });
  };

  return (
    <Container className={classes.container}>
      <Card>
        <h2 className={classes.title}>QR Code Starter Kit with React.js</h2>
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
                  <img src={imageUrl} alt="QR Code" />
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
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <h3>QR Code Scan by Web Cam</h3>
              <QrReader
                delay={300}
                style={{ width: '100%' }}
                onError={handleErrorWebCam}
                onScan={handleScanWebCam}
              />
              <h3>Scanned By WebCam Code: {scanResultWebCam}</h3>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={errorSnackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={errorSnackbar.message}
      />
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
