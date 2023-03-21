// import '.././Dashboard.css'
import './summary.css'
import React, { useMemo, useState,useCallback } from 'react';
import useBombStats from '../../../hooks/useBombStats';
import useLpStats from '../../../hooks/useLpStats';
import useLpStatsBTC from '../../../hooks/useLpStatsBTC';
import useBondStats from '../../../hooks/useBondStats';
import useTotalValueLocked from '../../../hooks/useTotalValueLocked';
// import { Bomb as bombTesting } from '../../bomb-finance/deployments/deployments.testing.json';
//import { Bomb as bombProd } from '../../bomb-finance/deployments/deployments.mainnet.json';
import { roundAndFormatNumber } from '../../../0x';
import useBombFinance from '../../../hooks/useBombFinance';
//import { ReactComponent as IconTelegram } from '../../assets/img/telegram.svg';
import { Helmet } from 'react-helmet';
import ProgressCountdown from '../../../views/Boardroom/components/ProgressCountdown';
import moment from 'moment';
import useTreasuryAllocationTimes from '../../../hooks/useTreasuryAllocationTimes';
import { Box, Card, CardContent, Button, Typography, Grid } from '@material-ui/core';
import useCurrentEpoch from '../../../hooks/useCurrentEpoch';
import ExchangeModal from '../../../views/Bond/components/ExchangeModal';
import useModal from '../../../hooks/useModal';
import { getDisplayBalance } from '../../../utils/formatBalance';
import { useTransactionAdder } from '../../../state/transactions/hooks';
import useTokenBalance from '../../../hooks/useTokenBalance';
import bshare1img from '../../../assets/img/bshare-200x200.png';
import bomb1img from '../../../assets/img/bomb.png';
import bbondimg from '../../../assets/img/bbond.png'; 
import usebShareStats from '../../../hooks/usebShareStats';

function Summary() {
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
      <div className='summary-parent'>
      <p className='top-p'>Bomb Finance Summary</p>
      <div className="summary center global-margin">
        <div className="table">
          <table>
            <tr>
              <th style={{borderBottom:'none'}}></th>
              <th style={{borderBottom:'none'}}></th>
              <th>Current Supply</th>
              <th>Total Supply</th>
              <th>Price</th>
              <th></th>
            </tr>
            <tr>
              <td style={{borderBottom:'none'}}><img src={bomb1img} style={{width:'30px',transform: 'translateY(6px)'}}/></td>
              <td>$BOMB</td>
              <td>{roundAndFormatNumber(Number(bombCirculatingSupply), 2)}</td>
              <td>{roundAndFormatNumber(Number(bombTotalSupply), 2)}</td>
              <td>${Number(bombPriceInDollars) ? roundAndFormatNumber(Number(bombPriceInDollars), 2) : '-.--'}</td>
              <td><img width="30" src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/512px-MetaMask_Fox.svg.png?20220831120339' alt='mm-img'/></td>
            </tr>
            <tr>
              <td style={{borderBottom:'none'}}><img src={bshare1img} style={{width:'35px',transform: 'translateY(6px)'}}/></td>
              <td>$BSHARE</td>
              <td>{roundAndFormatNumber(Number(bShareCirculatingSupply), 2)} </td>
              <td>{roundAndFormatNumber(Number(bShareTotalSupply), 2)}</td>
              <td>${Number(bSharePriceInDollars) ? Number(bSharePriceInDollars) : '-.--'}</td>
              <td><img width="30" src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/512px-MetaMask_Fox.svg.png?20220831120339' alt='mm-img'/></td>
            </tr>
            <tr>
              <td style={{borderBottom:'none'}}><img src={bbondimg} style={{width:'30px',transform: 'translateY(6px)'}}/></td>
              <td>$BBOND</td>
              <td>{roundAndFormatNumber(Number(tBondCirculatingSupply), 2)}</td>
              <td>{roundAndFormatNumber(Number(tBondTotalSupply), 2)}</td>
              <td>${Number(tBondPriceInDollars) ? Number(tBondPriceInDollars) : '-.--'}</td>
              <td><img width="30" src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/512px-MetaMask_Fox.svg.png?20220831120339'alt='mm-img'/></td>
            </tr>
          </table>
        </div>

        <div className="current-epoch">
          <div style={{borderBottom: '1px solid #ddd',fontSize:'20px'}}>
            Current Epoch<br/> <div style={{fontSize:'4rem',fontWeight:'bolder'}}>
            <Typography>{Number(currentEpoch)}</Typography>
            </div>
          </div>
          <div style={{borderBottom: '1px solid #ddd',fontSize:'1.3rem'}}>
          <div style={{fontSize:'2rem'}}><ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" /></div>
            <br/>
            Next Epoch in
          </div>
          <div>
              Live TWAP: <span style={{color:'#00e8a2'}}>1.17</span>  <br/>
              TVL: <span style={{color:'#00e8a2'}}>${(TVL).toFixed(0)}</span>  <br/>
              Last Epoch TWAP: <span style={{color:'#00e8a2'}}>1.22</span>  <br/>
          </div>

        </div>
      </div>
      </div>          
  )
}

export default Summary

