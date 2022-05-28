import AstraHouseEvent from './Event'
import AstraHousePastEvent from './PastEvent'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import Utils from "../../utils/Utils";
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';

const domainURL = process.env.NEXT_PUBLIC_API_URL || '';

const AstraHouseEvents = React.forwardRef((nftFunctions, ref) => { 
  const { publicKey, wallet, sendTransaction, signTransaction } = useWallet();

  const [isLoadingAuctionEvents, setIsLoadingAuctionEvents] = useState(true);
  const [auctionEvents, setAuctionEvents] = useState([]);

  const [isLoadingPastRaffles, setIsLoadingPastRaffles] = useState(true);
  const [pastRaffles, setPastRaffles] = useState([]);

  useEffect(() => {
    async function data() {
      await Promise.all([getGrimState(), loadAuctionEvents(), loadPastRaffles()])
    }

    data();
  }, [publicKey])

  const loadAuctionEvents = async () => {
    if(!publicKey){
      return
    }

    setIsLoadingAuctionEvents(true); 

    const walletAddress = publicKey.toString()

    try {
      const getAuctionEventsURL = `${domainURL}/auction-house`
      const result = await axios.get(`${getAuctionEventsURL}?wallet=${walletAddress}`);

      if (result?.data?.error) {
        console.error('Error:', result.data.error)
        return
      }

      if (result?.data?.success && result?.data?.raffles) {
        const activeRaffles = result.data.raffles.filter((auction:any) => {
          return auction.enabled
        })

        setAuctionEvents(activeRaffles);
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoadingAuctionEvents(false);
    }
  }

  const loadPastRaffles = async () => {
    if(!publicKey){
      return
    }

    setIsLoadingPastRaffles(true); 

    try {
      const getPastRafflesURL = `${domainURL}/auction-house/past-raffles`
      const result = await axios.get(`${getPastRafflesURL}`);

      if (result?.data?.error) {
        console.error('Error:', result.data.error)
        return
      }

      if (result?.data?.success && result?.data?.raffles) {
        const raffles = result.data.raffles.filter((auction:any) => {
          return auction.enabled
        })

        setPastRaffles(raffles);
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoadingPastRaffles(false);
    }
  }


  // $ASTRA balance
  const [pointsBalance, setPointsBalance] = useState(0);
  const getGrimState = async () => {
    if (!publicKey) return

    try {
      const getGrimStateURL = domainURL + "/grims-state";
      const result = await axios.get(getGrimStateURL + "?wallet=" + publicKey);
      if (result?.data?.success && result?.data?.wallet) {
        setPointsBalance(parseFloat(Utils.formatPoints(result.data.wallet.pointsBalance)));
      }
    } catch (err:any) {
      const errMessage = err.toJSON().message
      console.error('Error:', errMessage)
    }
  }

  const updateAstraBalance = (pointBalance:number) => {
    setPointsBalance(pointBalance)
  }

  return (
    <div>
      {isLoadingAuctionEvents && <div className="has-font-heading">Loading raffles...</div>}
      {!isLoadingAuctionEvents && auctionEvents.length === 0 && <Alert severity="info">There are no raffles at this time.</Alert>}
      
      {auctionEvents.length > 0 && (
        <Grid columns={24} container spacing={2} className="m-b-md">
          {auctionEvents.map((auction:any) =>
          <Grid item sm={12} md={24} key={auction._id}>
            <div className="box-light p-md has-border-radius-md">
              <AstraHouseEvent auction={auction} pointsBalance={pointsBalance} updatePointBalance={updateAstraBalance} />
            </div>
          </Grid>
          )}
        </Grid>
      )}
      
      <h2 className="has-font-gooper-bold">Past Events</h2>
      {pastRaffles.length > 0 && (
        <Grid columns={24} container spacing={2} className="m-b-md">
          {pastRaffles.map((auction:any) =>
          <Grid item sm={12} md={24} key={auction._id}>
            <div className="box-light p-md has-border-radius-md">
              <AstraHousePastEvent auction={auction} pointsBalance={pointsBalance} />
            </div>
          </Grid>
          )}
        </Grid>
      )}
    </div>
  )
});

export default AstraHouseEvents;