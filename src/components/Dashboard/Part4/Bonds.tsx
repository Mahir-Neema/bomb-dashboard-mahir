import './Bonds.css'
import React, { useMemo, useState,useCallback } from 'react';
import useBombStats from '../../../hooks/useBombStats';
import useLpStats from '../../../hooks/useLpStats';
import useLpStatsBTC from '../../../hooks/useLpStatsBTC';
import useBondStats from '../../../hooks/useBondStats';
import usebShareStats from '../../../hooks/usebShareStats';
import useTotalValueLocked from '../../../hooks/useTotalValueLocked';
import useBombFinance from '../../../hooks/useBombFinance';
import useTreasuryAllocationTimes from '../../../hooks/useTreasuryAllocationTimes';
import useCurrentEpoch from '../../../hooks/useCurrentEpoch';
import ExchangeModal from '../../../views/Bond/components/ExchangeModal';
import useModal from '../../../hooks/useModal';
import { getDisplayBalance } from '../../../utils/formatBalance';
import { useTransactionAdder } from '../../../state/transactions/hooks';
import useTokenBalance from '../../../hooks/useTokenBalance';
import bbondimg from '../../../assets/img/bbond.png'; 

import {Link} from 'react-router-dom';




// metamask connect

import TokenSymbol from '../../../components/TokenSymbol';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../../components/UnlockWallet';
import useBanks from '../../../hooks/useBanks';
import Banks from '../../../contexts/Banks';
import useBank from '../../../hooks/useBank';
import useRedeem from '../../../hooks/useRedeem';
import Investment from '.././Part2/Investment';
import Bombfarms from '.././Part3/Bombfarms';

function BondsPart() {
  const {account} = useWallet()
  const [banks] = useBanks();
  const activeBanks = banks.filter((bank) =>!bank.finished)[0];
  const bank = useBank(activeBanks.contract);
  const {onRedeem} = useRedeem(bank);
  const TVL = useTotalValueLocked();
  const bombFtmLpStats = useLpStatsBTC('BOMB-BTCB-LP');
  const bShareFtmLpStats = useLpStats('BSHARE-BNB-LP');
  const bombStats = useBombStats();
  const bShareStats = usebShareStats();
  const tBondStats = useBondStats();
  const bombFinance = useBombFinance();
  const bondBalance = useTokenBalance(bombFinance?.BBOND);
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
          <div style={{fontSize:'20px',margin:'40px 0 40px 0'}}>BBOND = {Number(bondStat?.tokenInFtm).toFixed(4) || '-'}</div>
        </div>
        <div>Available to redeem:
          <br/> <img src={bbondimg} style={{width:'50px',transform: 'translateY(30px)'}} alt="img"/>
          {getDisplayBalance(bondBalance)}
        </div>
        <div>
          <div style={{borderBottom: '1px solid #ddd'}}>
            Purchase BBond <button onClick={onPresent} style={{padding:'5px 10px'}}>purchase 🛒</button>
            <br/>
            Bomb is over peg
          </div>
          {!!account? <div style={{paddingTop:'10px'}}>
            Redeem Bomb <button style={{marginLeft:'15px',padding:'5px 10px'}} onClick={onRedeem}>Redeem ⬇️</button>
          </div>:<UnlockWallet/>}
        </div>
      </div>

      </div>
  )
}

export default BondsPart

