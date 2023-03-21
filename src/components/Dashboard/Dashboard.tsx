import './Dashboard.css'
import React, { useMemo, useState,useCallback } from 'react';
import useBombStats from '../../hooks/useBombStats';
import useLpStats from '../../hooks/useLpStats';
import useLpStatsBTC from '../../hooks/useLpStatsBTC';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import usebShareStats from '../../hooks/usebShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
// import { Bomb as bombTesting } from '../../bomb-finance/deployments/deployments.testing.json';
//import { Bomb as bombProd } from '../../bomb-finance/deployments/deployments.mainnet.json';
import { roundAndFormatNumber } from '../../0x';
import useBombFinance from '../../hooks/useBombFinance';
//import { ReactComponent as IconTelegram } from '../../assets/img/telegram.svg';
import { Helmet } from 'react-helmet';
import ProgressCountdown from '../../views/Boardroom/components/ProgressCountdown';
import moment from 'moment';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import { Box, Card, CardContent, Button, Typography, Grid } from '@material-ui/core';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import ExchangeModal from '../../views/Bond/components/ExchangeModal';
import useModal from '../../hooks/useModal';
import { getDisplayBalance } from '../../utils/formatBalance';
import { useTransactionAdder } from '../../state/transactions/hooks';
import useTokenBalance from '../../hooks/useTokenBalance';
import bshare1img from '../../assets/img/bshare-200x200.png';
import bomb1img from '../../assets/img/bomb.png';
import bbondimg from '../../assets/img/bbond.png'; 
import Summary from './Part1/summary';

function Dashboard() {
  const TVL = useTotalValueLocked();
  const bombFtmLpStats = useLpStatsBTC('BOMB-BTCB-LP');
  const bShareFtmLpStats = useLpStats('BSHARE-BNB-LP');
  const bombStats = useBombStats();
  const bShareStats = usebShareStats();
  const tBondStats = useBondStats();
  const bombFinance = useBombFinance();
  const { to } = useTreasuryAllocationTimes();
  const currentEpoch = useCurrentEpoch();
  const addTransaction = useTransactionAdder();
  const bondStat = useBondStats();
  // const bombmaxi = useBombMaxiStats('0xd6f52e8ab206e59a1e13b3d6c5b7f31e90ef46ef000200000000000000000028');

  // console.log(bombmaxi);
  // let bomb;
  // if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  //   bomb = bombTesting;
  // } else {
  //   bomb = bombProd;
  // }

  const buyBombAddress = //'https://app.1inch.io/#/56/swap/BTCB/BOMB';
    //  'https://pancakeswap.finance/swap?inputCurrency=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&outputCurrency=' +
    'https://app.bogged.finance/bsc/swap?tokenIn=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&tokenOut=0x522348779DCb2911539e76A1042aA922F9C47Ee3';
  //https://pancakeswap.finance/swap?outputCurrency=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
  const buyBShareAddress = //'https://app.1inch.io/#/56/swap/BNB/BSHARE';
    'https://app.bogged.finance/bsc/swap?tokenIn=BNB&tokenOut=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
  const buyBusmAddress =
    'https://app.bogged.finance/bsc/swap?tokenIn=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&tokenOut=0x6216B17f696B14701E17BCB24Ec14430261Be94A';
  const bombLPStats = useMemo(() => (bombFtmLpStats ? bombFtmLpStats : null), [bombFtmLpStats]);
  const bshareLPStats = useMemo(() => (bShareFtmLpStats ? bShareFtmLpStats : null), [bShareFtmLpStats]);
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );
  const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);

  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );
  const bSharePriceInBNB = useMemo(
    () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
    [bShareStats],
  );
  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const balance = useTokenBalance(bombFinance?.BBOND)
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);
  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await bombFinance.redeemBonds(amount);
      addTransaction(tx, {summary: `Redeem ${amount} BBOND`});
      // addTransaction(tx);
    },
    [bombFinance, addTransaction],
  );
  const [onPresent, onDismiss] = useModal(
    <ExchangeModal
      title={"Purchase"}
      description={`${getDisplayBalance(balance)} BBOND Available in wallet`}
      max={balance}
      onConfirm={(value) => {
        handleRedeemBonds(value);
        onDismiss();
      }}
      action={"Purchase"}
      tokenName={'BOMB'}
    />,
  );
  return (
    <div className='dashboard'>
      <Summary/>

      <div style={{marginBottom:'30px'}}>
      <div className='left-latest-news dp-i'>
        <div className="investment-strgy">Read Investment Strategy ›</div>
        <div className="invest-now center">Invest Now</div>
        <div className="discord dp-i global-margin">Chat on Discord</div>
        <div className="docs dp-i global-margin">Read docs</div>
        <div className="board-room">
          <div style={{borderBottom: '1px solid #ddd'}}>
            <img src={bshare1img} style={{width:'30px',transform: 'translateY(6px)'}}/>
          BoardRoom
          <span style={{margin:'20px',backgroundColor:'#0aa583',padding:'0 5px 0 5px'}}>Recommended</span>
          <br></br>
          <div className='dp-i' style={{padding:'10px 0 10px 0'}}>Stake BSHARE and earn BOMB every epoch</div>
          <span style={{marginLeft:'7vw'}}>TVL: $1,008,430</span>
          </div>

          <div>
            <div className="total-staked">Total Staked: 7232</div>
            <div className="daily-returns dp-i">Daily-returns:<br/><span style={{fontSize:'25px',fontWeight:'bolder'}}>2%</span></div>
            <div className="yourstake dp-i">Your stake:<br/>6.0000<br/>≈$1171.62</div>
            <div className="earned dp-i">Earned:<br/>1660.4413<br/>≈$298.88</div>
            <div className="boardroom-buttons dp-i">
              <div className="depo-with">
                <button>Deposit 🔼</button>
                <button>Withdraw 🔽</button>
              </div>
              <div className="claimrewards">
                <button style={{padding:'3px 46px 3px 46px'}}>Claim Rewards</button>
              </div>
            </div>

          </div>

        </div>
      </div>

      <div className="latest-news dp-i">Latest News</div>
      </div>
      <span></span>

      <div className="Bomb-farms  global-margin">
      <div>
        Bonds
          <br></br>
          <span className='dp-i' style={{padding:'10px 0 10px 70px'}}>BBOND can be purchased only on contraction periods, when T WAP of BOMB is below I</span>
      </div>
      </div>



      <div className="bonds global-margin">
      <div>
      <img src={bbondimg} style={{width:'70px',transform: 'translateY(30px)'}}/>
        Bonds
          <br></br>
          <span className='dp-i' style={{padding:'10px 0 10px 70px'}}>BBOND can be purchased only on contraction periods, when T WAP of BOMB is below I</span>
      </div>

      <div className="bonds-lower">
        <div>Current Price: (Bomb)^2
          <br/>
          <div>BBOND = {Number(bondStat?.tokenInFtm).toFixed(4) || '-'}</div>
        </div>
        <div>Available to redeem:</div>
        <div><button onClick={onPresent}>purchase</button></div>
      </div>

      </div>
    </div>
  )
}

export default Dashboard

