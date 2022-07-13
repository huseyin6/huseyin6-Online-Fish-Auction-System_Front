import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import FishermanNavigation from '../FishermanNavigation';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import axios from '../../../../axios';
import moment from 'moment';
import 'moment/locale/tr';
import fish from "../../../../fish.jpg";

const theme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#3C76C0',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    white: {
      main: '#FFFFFF'
    },
    grey: {
      main: '#E1DDE1',
    },
  }
});

function FishermanSalesPage() {
  const [loading, setLoading] = useState(false);
  const [allTransactionArray, setAllTransactionArray] = useState([]);

  const fisherman = JSON.parse(localStorage.getItem('user'));
  const id = fisherman._id;
  console.log(fisherman);
  console.log(id);

  const [salesByFishermanId, setSalesByFishermanId] = useState([]);

  const handleGetSalesByFishermanId = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`/sale/getSalesByFishermanId/${id}`, {
      });
      console.log(response);
      if (response.status === 200) {
        console.log(response.data);
        setSalesByFishermanId(response.data);
        let temp = response.data;
        let arr = [];
        console.log(temp);

        for (let i = 0; i < temp.length; i++) {
          let item = {
            id: temp[i]._id,
            auctionDate: moment(temp[i].auctionId.auctionDate).format('LLL'),
            fishType: temp[i].fishType,
            fishQuantity: temp[i].quantity,
            soldPrice: temp[i].soldPrice
          };
          arr.push(item);
        }
        setAllTransactionArray(arr);
        console.log(arr);
        console.log(allTransactionArray);

      } else {
        console.log('failed');
      }
    }
    catch (e) {
      console.log(e);
    }
    setLoading(false);
  }
  useEffect(() => {
    handleGetSalesByFishermanId(id);
  }, []);


  return (
    <div style={{
      backgroundImage: `url(${fish})`,
      //backgroundPosition: 'center',
      backgroundSize: 'cover',
      //backgroundRepeat: 'no-repeat',
      width: '100vw',
      height: '100vh'

    }}>
      <div>
        <FishermanNavigation />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
        }}>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: "50px"
          }}>
            <ThemeProvider theme={theme}>
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Typography variant="h4" component="div" sx={{ flexGrow: 1, textAlign: "center", my: 3 }} color="primary">
                  Satışlarım
                </Typography>
                <TableContainer sx={{ maxHeight: 700 }}>
                  <Table stickyHeader sx={{ minWidth: 1500 }} aria-label="all fish table">
                    <TableHead sx={{ backgroundColor: "grey", fontSize: 22 }}>
                      <TableRow>
                        <TableCell align="center">Mezat Tarihi</TableCell>
                        <TableCell align="center">Balık Türü</TableCell>
                        <TableCell align="center">Balık Miktarı&nbsp;(kg)</TableCell>
                        <TableCell align="center">Başlangıç Fiyatı&nbsp;(tl)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allTransactionArray.map((row) => (
                        <TableRow
                          key={row.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell align="center">{row.auctionDate}</TableCell>
                          <TableCell align="center">{row.fishType}</TableCell>
                          <TableCell align="center">{row.fishQuantity}</TableCell>
                          <TableCell align="center">{row.fishPrice}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </ThemeProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FishermanSalesPage;